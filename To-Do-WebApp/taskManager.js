/**
 * taskManager.js
 * Pure business-logic layer for task CRUD operations.
 * Keeps task state and delegates persistence to Storage.
 * Zero DOM interaction — all UI is in ui.js / app.js.
 *
 * @typedef {Object} Task
 * @property {string}  id          - UUID-style unique identifier
 * @property {string}  text        - Task description
 * @property {'low'|'medium'|'high'} priority
 * @property {boolean} completed   - Whether the task is done
 * @property {string}  createdAt   - ISO 8601 timestamp
 * @property {string|null} completedAt - ISO 8601 timestamp or null
 */

const TaskManager = (() => {

  /** @type {Task[]} In-memory task list */
  let tasks = [];

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Generate a short random ID.
   * @returns {string}
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /**
   * Return current ISO timestamp string.
   * @returns {string}
   */
  function now() {
    return new Date().toISOString();
  }

  /**
   * Persist current state to localStorage.
   */
  function persist() {
    Storage.save(tasks);
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Initialise the manager by loading saved tasks.
   * Must be called once before any other method.
   * @returns {Task[]}
   */
  function init() {
    tasks = Storage.load();
    return tasks;
  }

  /**
   * Return a shallow copy of the task list.
   * @returns {Task[]}
   */
  function getAll() {
    return [...tasks];
  }

  /**
   * Return all pending (incomplete) tasks.
   * @returns {Task[]}
   */
  function getPending() {
    return tasks.filter(t => !t.completed);
  }

  /**
   * Return all completed tasks.
   * @returns {Task[]}
   */
  function getCompleted() {
    return tasks.filter(t => t.completed);
  }

  /**
   * Find a task by id.
   * @param {string} id
   * @returns {Task|undefined}
   */
  function getById(id) {
    return tasks.find(t => t.id === id);
  }

  /**
   * Create and append a new task.
   * @param {string} text
   * @param {'low'|'medium'|'high'} priority
   * @returns {Task} The newly created task.
   * @throws {Error} if text is blank.
   */
  function addTask(text, priority = 'medium') {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Task text cannot be empty.');

    /** @type {Task} */
    const task = {
      id:          generateId(),
      text:        trimmed,
      priority,
      completed:   false,
      createdAt:   now(),
      completedAt: null,
    };

    tasks.unshift(task); // most-recent first
    persist();
    return task;
  }

  /**
   * Toggle the completed state of a task.
   * Sets / clears completedAt accordingly.
   * @param {string} id
   * @returns {Task|null} Updated task or null if not found.
   */
  function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return null;

    task.completed   = !task.completed;
    task.completedAt = task.completed ? now() : null;
    persist();
    return task;
  }

  /**
   * Update the text and/or priority of a task.
   * @param {string} id
   * @param {Partial<Pick<Task,'text'|'priority'>>} updates
   * @returns {Task|null}
   * @throws {Error} if updated text is blank.
   */
  function editTask(id, { text, priority } = {}) {
    const task = tasks.find(t => t.id === id);
    if (!task) return null;

    if (text !== undefined) {
      const trimmed = text.trim();
      if (!trimmed) throw new Error('Task text cannot be empty.');
      task.text = trimmed;
    }
    if (priority !== undefined) {
      task.priority = priority;
    }

    persist();
    return task;
  }

  /**
   * Remove a task permanently.
   * @param {string} id
   * @returns {boolean} true if a task was removed.
   */
  function deleteTask(id) {
    const before = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    const removed = tasks.length < before;
    if (removed) persist();
    return removed;
  }

  return { init, getAll, getPending, getCompleted, getById, addTask, toggleComplete, editTask, deleteTask };
})();
