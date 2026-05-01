/**
 * constants.js
 * Application-wide constants and configuration.
 */

"use strict";

const UNITS = Object.freeze({
  CELSIUS:    "C",
  FAHRENHEIT: "F",
  KELVIN:     "K",
});

const UNIT_LABELS = Object.freeze({
  [UNITS.CELSIUS]:    "Celsius",
  [UNITS.FAHRENHEIT]: "Fahrenheit",
  [UNITS.KELVIN]:     "Kelvin",
});

const UNIT_SYMBOLS = Object.freeze({
  [UNITS.CELSIUS]:    "°C",
  [UNITS.FAHRENHEIT]: "°F",
  [UNITS.KELVIN]:     "K",
});

const UNIT_CSS_MODIFIER = Object.freeze({
  [UNITS.CELSIUS]:    "celsius",
  [UNITS.FAHRENHEIT]: "fahrenheit",
  [UNITS.KELVIN]:     "kelvin",
});

/** Absolute zero in each unit. */
const ABSOLUTE_ZERO = Object.freeze({
  [UNITS.CELSIUS]:    -273.15,
  [UNITS.FAHRENHEIT]: -459.67,
  [UNITS.KELVIN]:     0,
});

/** Decimal places for rounding results. */
const DECIMAL_PLACES = 2;

/** Error messages. */
const ERRORS = Object.freeze({
  EMPTY:        "Please enter a temperature value.",
  NOT_A_NUMBER: "That doesn't look like a number. Try again.",
  BELOW_ZERO_K: "Temperature cannot be below absolute zero (0 K).",
});
