/**
 * converter.js
 * Pure conversion functions. No DOM access.
 * All functions accept and return plain numbers.
 */

"use strict";

/**
 * Convert Celsius to Fahrenheit.
 * @param {number} c
 * @returns {number}
 */
function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

/**
 * Convert Celsius to Kelvin.
 * @param {number} c
 * @returns {number}
 */
function celsiusToKelvin(c) {
  return c + 273.15;
}

/**
 * Convert Fahrenheit to Celsius.
 * @param {number} f
 * @returns {number}
 */
function fahrenheitToCelsius(f) {
  return ((f - 32) * 5) / 9;
}

/**
 * Convert Fahrenheit to Kelvin.
 * @param {number} f
 * @returns {number}
 */
function fahrenheitToKelvin(f) {
  return celsiusToKelvin(fahrenheitToCelsius(f));
}

/**
 * Convert Kelvin to Celsius.
 * @param {number} k
 * @returns {number}
 */
function kelvinToCelsius(k) {
  return k - 273.15;
}

/**
 * Convert Kelvin to Fahrenheit.
 * @param {number} k
 * @returns {number}
 */
function kelvinToFahrenheit(k) {
  return celsiusToFahrenheit(kelvinToCelsius(k));
}

/**
 * Round a number to a fixed number of decimal places,
 * then strip trailing zeros (e.g. 100.00 → "100").
 * @param {number} value
 * @param {number} places
 * @returns {string}
 */
function formatValue(value, places = DECIMAL_PLACES) {
  return parseFloat(value.toFixed(places)).toString();
}

/**
 * Convert a temperature from one unit to all other units.
 * Returns an object keyed by unit, excluding the source unit.
 *
 * @param {number} value   - The temperature to convert.
 * @param {string} fromUnit - One of UNITS.*
 * @returns {Object.<string, string>} e.g. { F: "212", K: "373.15" }
 */
function convertAll(value, fromUnit) {
  const conversions = {
    [UNITS.CELSIUS]: {
      [UNITS.FAHRENHEIT]: celsiusToFahrenheit(value),
      [UNITS.KELVIN]:     celsiusToKelvin(value),
    },
    [UNITS.FAHRENHEIT]: {
      [UNITS.CELSIUS]: fahrenheitToCelsius(value),
      [UNITS.KELVIN]:  fahrenheitToKelvin(value),
    },
    [UNITS.KELVIN]: {
      [UNITS.CELSIUS]:    kelvinToCelsius(value),
      [UNITS.FAHRENHEIT]: kelvinToFahrenheit(value),
    },
  };

  const results = conversions[fromUnit];

  return Object.fromEntries(
    Object.entries(results).map(([unit, raw]) => [unit, formatValue(raw)])
  );
}
