/**
 * storage.js
 * Handles all localStorage read/write operations.
 * Follows the single-responsibility principle — no DOM logic here.
 */

const Storage = (() => {
  const KEY = 'taska_tasks_v1';

  /**
   * Load all tasks from localStorage.
   * @returns {Task[]} Array of task objects (may be empty).
   */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('[Storage] Failed to load tasks:', err);
      return [];
    }
  }

  /**
   * Persist the full task array to localStorage.
   * @param {Task[]} tasks
   */
  function save(tasks) {
    try {
      localStorage.setItem(KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('[Storage] Failed to save tasks:', err);
    }
  }

  /**
   * Wipe all stored tasks (useful for testing / reset).
   */
  function clear() {
    localStorage.removeItem(KEY);
  }

  return { load, save, clear };
})();
