/**
 * ui.js
 * Responsible for all DOM rendering and manipulation.
 * Receives plain task objects from TaskManager — no data fetching here.
 */

const UI = (() => {

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const pendingList    = document.getElementById('pending-list');
  const completedList  = document.getElementById('completed-list');
  const emptyPending   = document.getElementById('empty-pending');
  const emptyCompleted = document.getElementById('empty-completed');

  const countTotal   = document.getElementById('count-total');
  const countPending = document.getElementById('count-pending');
  const countDone    = document.getElementById('count-done');
  const badgePending = document.getElementById('badge-pending');
  const badgeDone    = document.getElementById('badge-done');

  const editModal     = document.getElementById('edit-modal');
  const editInput     = document.getElementById('edit-input');
  const editPriority  = document.getElementById('edit-priority');
  const btnSaveEdit   = document.getElementById('btn-save-edit');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const btnModalClose = document.getElementById('btn-modal-close');

  const charCount    = document.getElementById('char-count');
  const charCounter  = document.querySelector('.char-counter');
  const taskInput    = document.getElementById('task-input');

  const footerDate   = document.getElementById('footer-date');

  /** Currently editing task id */
  let editingId = null;

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Format an ISO timestamp into a readable short form.
   * @param {string} iso
   * @returns {string}
   */
  function formatTimestamp(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day:   'numeric',
      hour:  '2-digit',
      minute:'2-digit',
    });
  }

  /**
   * Animate stat counter number update.
   * @param {HTMLElement} el
   * @param {number} value
   */
  function animateCounter(el, value) {
    el.classList.remove('flip');
    // Force reflow to restart animation
    void el.offsetWidth;
    el.textContent = value;
    el.classList.add('flip');
  }

  // ── Card rendering ────────────────────────────────────────────────────────

  /**
   * Build a task card DOM element.
   * @param {import('./taskManager').Task} task
   * @returns {HTMLElement}
   */
  function buildTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority}${task.completed ? ' completed-card' : ''}`;
    card.dataset.id = task.id;

    // Checkbox
    const check = document.createElement('button');
    check.className = `task-check${task.completed ? ' is-done' : ''}`;
    check.setAttribute('aria-label', task.completed ? 'Mark as pending' : 'Mark as complete');
    check.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>`;
    check.addEventListener('click', () => handleToggle(task.id, check, card));

    // Body
    const body = document.createElement('div');
    body.className = 'task-body';

    const textEl = document.createElement('p');
    textEl.className = 'task-text';
    textEl.textContent = task.text;

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    // Priority tag
    const pTag = document.createElement('span');
    pTag.className = `priority-tag priority-${task.priority}`;
    pTag.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    // Created timestamp
    const createdTs = document.createElement('span');
    createdTs.className = 'task-timestamp';
    createdTs.innerHTML = `
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      Added ${formatTimestamp(task.createdAt)}`;

    meta.append(pTag, createdTs);

    // Completed timestamp (if done)
    if (task.completed && task.completedAt) {
      const doneTs = document.createElement('span');
      doneTs.className = 'task-timestamp';
      doneTs.style.color = 'var(--clr-done)';
      doneTs.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Done ${formatTimestamp(task.completedAt)}`;
      meta.appendChild(doneTs);
    }

    body.append(textEl, meta);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-action btn-edit';
    btnEdit.setAttribute('aria-label', 'Edit task');
    btnEdit.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>`;
    btnEdit.addEventListener('click', () => openEditModal(task.id));

    const btnDel = document.createElement('button');
    btnDel.className = 'btn-action btn-delete';
    btnDel.setAttribute('aria-label', 'Delete task');
    btnDel.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>`;
    btnDel.addEventListener('click', () => handleDelete(task.id, card));

    actions.append(btnEdit, btnDel);
    card.append(check, body, actions);
    return card;
  }

  // ── Event handlers (internal) ─────────────────────────────────────────────

  function handleToggle(id, checkEl, cardEl) {
    const updated = TaskManager.toggleComplete(id);
    if (!updated) return;

    checkEl.classList.add('bounce');
    checkEl.addEventListener('animationend', () => checkEl.classList.remove('bounce'), { once: true });

    // Animate removal, then re-render
    cardEl.classList.add('leaving');
    cardEl.addEventListener('animationend', () => {
      renderLists();
    }, { once: true });
  }

  function handleDelete(id, cardEl) {
    cardEl.classList.add('leaving');
    cardEl.addEventListener('animationend', () => {
      TaskManager.deleteTask(id);
      renderLists();
    }, { once: true });
  }

  // ── Edit modal ────────────────────────────────────────────────────────────

  function openEditModal(id) {
    const task = TaskManager.getById(id);
    if (!task) return;

    editingId = id;
    editInput.value    = task.text;
    editPriority.value = task.priority;
    editModal.classList.add('open');
    editInput.focus();
    editInput.select();
  }

  function closeEditModal() {
    editModal.classList.remove('open');
    editingId = null;
  }

  function saveEdit() {
    if (!editingId) return;
    const text     = editInput.value.trim();
    const priority = editPriority.value;
    if (!text) { editInput.focus(); return; }

    try {
      TaskManager.editTask(editingId, { text, priority });
      closeEditModal();
      renderLists();
    } catch (err) {
      console.error(err);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  /**
   * Full re-render of both lists and all counters.
   */
  function renderLists() {
    const pending   = TaskManager.getPending();
    const completed = TaskManager.getCompleted();
    const total     = pending.length + completed.length;

    // Update counters
    animateCounter(countTotal,   total);
    animateCounter(countPending, pending.length);
    animateCounter(countDone,    completed.length);
    badgePending.textContent = pending.length;
    badgeDone.textContent    = completed.length;

    // Clear lists (keep empty-state elements)
    [...pendingList.children].forEach(child => {
      if (!child.classList.contains('empty-state')) child.remove();
    });
    [...completedList.children].forEach(child => {
      if (!child.classList.contains('empty-state')) child.remove();
    });

    // Pending
    emptyPending.style.display = pending.length === 0 ? '' : 'none';
    pending.forEach((task, i) => {
      const card = buildTaskCard(task);
      card.style.animationDelay = `${i * 30}ms`;
      card.classList.add('entering');
      pendingList.appendChild(card);
    });

    // Completed
    emptyCompleted.style.display = completed.length === 0 ? '' : 'none';
    completed.forEach((task, i) => {
      const card = buildTaskCard(task);
      card.style.animationDelay = `${i * 30}ms`;
      card.classList.add('entering');
      completedList.appendChild(card);
    });
  }

  /**
   * Update the character counter for the add-task input.
   * @param {number} len
   */
  function updateCharCount(len) {
    charCount.textContent = len;
    charCounter.classList.toggle('warn', len > 170);
  }

  /**
   * Set footer date string.
   */
  function setFooterDate() {
    footerDate.textContent = new Date().toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // ── Init modal events ─────────────────────────────────────────────────────

  function initModalEvents() {
    btnSaveEdit.addEventListener('click', saveEdit);
    btnCancelEdit.addEventListener('click', closeEditModal);
    btnModalClose.addEventListener('click', closeEditModal);
    editModal.addEventListener('click', e => {
      if (e.target === editModal) closeEditModal();
    });
    editInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveEdit();
      if (e.key === 'Escape') closeEditModal();
    });
    taskInput.addEventListener('input', () => updateCharCount(taskInput.value.length));
  }

  return {
    renderLists,
    updateCharCount,
    setFooterDate,
    initModalEvents,
  };
})();
