/**
 * ui.js
 * DOM manipulation and rendering helpers.
 * Depends on: constants.js, converter.js
 */

"use strict";

/* ── Element references ── */
const UI = {
  input:            document.getElementById("temperatureInput"),
  inputUnit:        document.getElementById("inputUnit"),
  errorMsg:         document.getElementById("inputError"),
  convertBtn:       document.getElementById("convertBtn"),
  resultContainer:  document.getElementById("resultContainer"),
  resultPlaceholder:document.getElementById("resultPlaceholder"),
  resultCards:      document.getElementById("resultCards"),
  unitRadios:       document.querySelectorAll('input[name="inputUnit"]'),
};

/* ── Error state ── */

/**
 * Show an error message and apply error styles.
 * @param {string} message
 */
function showError(message) {
  UI.errorMsg.textContent = message;
  UI.errorMsg.classList.add("is-visible");
  UI.input.classList.add("is-error");

  // Shake animation: remove → force reflow → add
  UI.input.classList.remove("shake");
  void UI.input.offsetWidth; // trigger reflow
  UI.input.classList.add("shake");
}

/**
 * Clear the error state.
 */
function clearError() {
  UI.errorMsg.textContent = "";
  UI.errorMsg.classList.remove("is-visible");
  UI.input.classList.remove("is-error", "shake");
}

/* ── Input unit badge ── */

/**
 * Update the unit badge shown inside the input field.
 * @param {string} unit - UNITS.*
 */
function updateInputUnitBadge(unit) {
  UI.inputUnit.textContent = UNIT_SYMBOLS[unit];
}

/* ── Result rendering ── */

/**
 * Build a single result card element.
 * @param {string} unit  - UNITS.*
 * @param {string} value - Formatted numeric string.
 * @returns {HTMLElement}
 */
function createResultCard(unit, value) {
  const card = document.createElement("article");
  card.className = `result-card result-card--${UNIT_CSS_MODIFIER[unit]}`;
  card.setAttribute("aria-label", `${value} ${UNIT_LABELS[unit]}`);

  card.innerHTML = `
    <span class="result-card__label">${UNIT_LABELS[unit]}</span>
    <span class="result-card__value">${value}</span>
    <span class="result-card__unit">${UNIT_SYMBOLS[unit]}</span>
  `;

  return card;
}

/**
 * Render all result cards.
 * @param {Object.<string, string>} results - { unit: formattedValue }
 */
function renderResults(results) {
  const entries = Object.entries(results);

  // Clear previous results
  UI.resultCards.innerHTML = "";

  entries.forEach(([unit, value]) => {
    UI.resultCards.appendChild(createResultCard(unit, value));
  });

  // Single result gets full width
  if (entries.length === 1) {
    UI.resultCards.classList.add("result__cards--single");
  } else {
    UI.resultCards.classList.remove("result__cards--single");
  }

  // Show cards, hide placeholder
  UI.resultPlaceholder.hidden = true;
  UI.resultCards.hidden = false;

  // Trigger re-animation: remove and re-add the cards to restart CSS animations
  const clone = UI.resultCards.cloneNode(true);
  UI.resultCards.parentNode.replaceChild(clone, UI.resultCards);
  UI.resultCards = document.getElementById("resultCards") ?? clone;
}

/**
 * Reset results back to placeholder state.
 */
function resetResults() {
  UI.resultCards.innerHTML = "";
  UI.resultCards.hidden = true;
  UI.resultPlaceholder.hidden = false;
}
