/**
 * main.js
 * Entry point. Wires up event listeners and orchestrates
 * validator → converter → ui pipeline.
 *
 * Depends on: constants.js, converter.js, validator.js, ui.js
 */

"use strict";

/* ── State ── */
let selectedUnit = UNITS.CELSIUS;

/* ── Helpers ── */

/**
 * Get the currently selected input unit from radio buttons.
 * @returns {string} UNITS.*
 */
function getSelectedUnit() {
  for (const radio of UI.unitRadios) {
    if (radio.checked) return radio.value;
  }
  return UNITS.CELSIUS;
}

/**
 * Core convert action: validate → convert → render.
 */
function handleConvert() {
  const rawInput = UI.input.value;
  const unit     = getSelectedUnit();

  const { valid, error, value } = validateInput(rawInput, unit);

  if (!valid) {
    showError(error);
    resetResults();
    return;
  }

  clearError();

  const results = convertAll(value, unit);
  renderResults(results);
}

/* ── Event Listeners ── */

// Convert button click
UI.convertBtn.addEventListener("click", handleConvert);

// "Enter" key in input
UI.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleConvert();
});

// Clear error on every keystroke
UI.input.addEventListener("input", () => {
  if (UI.input.classList.contains("is-error")) {
    clearError();
  }
});

// Unit radio change — update badge and re-run if there's a value
UI.unitRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    selectedUnit = radio.value;
    updateInputUnitBadge(selectedUnit);

    // Re-convert automatically if input already has a value
    if (UI.input.value.trim() !== "") {
      handleConvert();
    }
  });
});

/* ── Init ── */
(function init() {
  updateInputUnitBadge(UNITS.CELSIUS);
  UI.input.focus();
})();
