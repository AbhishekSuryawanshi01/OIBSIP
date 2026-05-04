/**
 * app.js
 * Entry point — bootstraps the app and wires up user interactions.
 * Delegates all data work to TaskManager and all DOM work to UI.
 */

(() => {
  'use strict';

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const taskInput      = document.getElementById('task-input');
  const prioritySelect = document.getElementById('priority-select');
  const btnAdd         = document.getElementById('btn-add');

  // ── Bootstrap ─────────────────────────────────────────────────────────────

  function init() {
    // Load persisted tasks
    TaskManager.init();

    // Render initial state
    UI.renderLists();
    UI.setFooterDate();
    UI.initModalEvents();

    // Bind add-task events
    btnAdd.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleAddTask();
    });

    // Focus input on load
    taskInput.focus();
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  /**
   * Read form values, create a task, and refresh the UI.
   */
  function handleAddTask() {
    const text     = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!text) {
      taskInput.focus();
      shakeInput();
      return;
    }

    try {
      TaskManager.addTask(text, priority);
      taskInput.value = '';
      prioritySelect.value = 'medium';
      UI.updateCharCount(0);
      UI.renderLists();
      taskInput.focus();
    } catch (err) {
      console.error('[App] Failed to add task:', err.message);
    }
  }

  /**
   * Briefly shake the input field to signal validation failure.
   */
  function shakeInput() {
    const card = document.querySelector('.add-task-card');
    card.style.transition = 'transform 0.08s ease';
    const shakes = [6, -6, 5, -4, 3, 0];
    let i = 0;
    const step = () => {
      if (i >= shakes.length) { card.style.transform = ''; return; }
      card.style.transform = `translateX(${shakes[i++]}px)`;
      setTimeout(step, 60);
    };
    step();
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

})();
