/**
 * validator.js
 * Input validation helpers. Returns structured result objects.
 */

"use strict";

/**
 * Validation result shape.
 * @typedef {{ valid: boolean, error: string|null, value: number|null }} ValidationResult
 */

/**
 * Validate a raw string temperature input.
 *
 * @param {string} rawInput  - The value from the input field.
 * @param {string} unit      - The selected unit (UNITS.*).
 * @returns {ValidationResult}
 */
function validateInput(rawInput, unit) {
  const trimmed = rawInput.trim();

  if (trimmed === "" || trimmed === null) {
    return { valid: false, error: ERRORS.EMPTY, value: null };
  }

  const num = Number(trimmed);

  if (isNaN(num)) {
    return { valid: false, error: ERRORS.NOT_A_NUMBER, value: null };
  }

  // Check absolute zero bounds
  const minValue = ABSOLUTE_ZERO[unit];
  if (num < minValue) {
    return {
      valid: false,
      error: ERRORS.BELOW_ZERO_K,
      value: null,
    };
  }

  return { valid: true, error: null, value: num };
}
