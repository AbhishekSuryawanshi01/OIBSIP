/**
 * calculator/script.js
 * ──────────────────────────────────────────────────────────
 * Full-featured calculator with:
 *  - Basic operations: +, −, ×, ÷
 *  - Percent (%), sign toggle (+/−), decimal point
 *  - Chained operations & operator precedence display
 *  - Keyboard support
 *  - Error handling (division by zero, etc.)
 *  - Dynamic font scaling on the display
 * ──────────────────────────────────────────────────────────
 */

"use strict";

/* ============================================================
   STATE
   ============================================================ */

/** @type {CalcState} */
const state = {
  currentValue:   "0",   // What's shown on the main display
  previousValue:  null,  // Stored operand
  operator:       null,  // Pending operator: +, −, ×, ÷
  waitingForNext: false, // True right after operator is pressed
  justEvaluated:  false, // True right after = is pressed
};

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const resultEl    = document.getElementById("result");
const expressionEl = document.getElementById("expression");
const allButtons  = document.querySelectorAll(".btn");

/* ============================================================
   DISPLAY HELPERS
   ============================================================ */

/**
 * Update the main result display with dynamic font scaling.
 * @param {string} text
 */
function setResult(text) {
  resultEl.textContent = text;

  // Remove old size classes
  resultEl.classList.remove("sm", "xs", "xxs", "error");

  const len = text.length;
  if (len > 14)      resultEl.classList.add("xxs");
  else if (len > 10) resultEl.classList.add("xs");
  else if (len > 7)  resultEl.classList.add("sm");
}

/**
 * Update the expression / history line above the result.
 * @param {string} text
 */
function setExpression(text) {
  expressionEl.textContent = text;
}

/**
 * Trigger the pop animation on the result display.
 */
function animatePop() {
  resultEl.classList.remove("pop");
  // Force reflow to restart the animation
  void resultEl.offsetWidth;
  resultEl.classList.add("pop");
}

/**
 * Show an error message on the display.
 * @param {string} [msg]
 */
function showError(msg = "Error") {
  setResult(msg);
  resultEl.classList.add("error");
  setExpression("");
  resetState();
}

/* ============================================================
   STATE MANAGEMENT
   ============================================================ */

/**
 * Fully reset calculator state (but not the display).
 */
function resetState() {
  state.currentValue   = "0";
  state.previousValue  = null;
  state.operator       = null;
  state.waitingForNext = false;
  state.justEvaluated  = false;
}

/**
 * Highlight the currently active operator button.
 * @param {string|null} op
 */
function setActiveOperator(op) {
  document.querySelectorAll(".btn-op").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === op);
  });
}

/* ============================================================
   FORMATTING
   ============================================================ */

/**
 * Format a number for display — limits decimal places and handles
 * scientific notation for very large/small results.
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  if (!isFinite(num)) return "Error";

  // Avoid floating-point noise (e.g. 0.1+0.2 = 0.30000000004)
  const rounded = parseFloat(num.toPrecision(12));

  // Use exponential notation only if necessary
  if (Math.abs(rounded) >= 1e13 || (Math.abs(rounded) < 1e-7 && rounded !== 0)) {
    return rounded.toExponential(4);
  }

  // Trim trailing zeros after decimal
  return String(rounded);
}

/* ============================================================
   MATH ENGINE
   ============================================================ */

/**
 * Map display symbols to real JS operators and evaluate.
 * @param {number} a
 * @param {number} b
 * @param {string} op
 * @returns {number}
 */
function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷":
      if (b === 0) throw new Error("Division by zero");
      return a / b;
    default:
      throw new Error("Unknown operator: " + op);
  }
}

/* ============================================================
   ACTION HANDLERS
   ============================================================ */

/**
 * Handle a digit (0–9) press.
 * @param {string} digit
 */
function handleDigit(digit) {
  setActiveOperator(null); // Clear operator highlight on new input

  if (state.waitingForNext || state.justEvaluated) {
    // Start fresh input
    state.currentValue   = digit;
    state.waitingForNext = false;
    state.justEvaluated  = false;
  } else {
    // Append digit; guard against leading zeros & 15-char limit
    if (state.currentValue === "0" && digit !== ".") {
      state.currentValue = digit;
    } else if (state.currentValue.length < 15) {
      state.currentValue += digit;
    }
  }

  setResult(state.currentValue);
}

/**
 * Handle decimal point press.
 */
function handleDecimal() {
  if (state.waitingForNext || state.justEvaluated) {
    state.currentValue   = "0.";
    state.waitingForNext = false;
    state.justEvaluated  = false;
    setResult(state.currentValue);
    return;
  }

  // Only one decimal point allowed
  if (!state.currentValue.includes(".")) {
    state.currentValue += ".";
    setResult(state.currentValue);
  }
}

/**
 * Handle an operator (+, −, ×, ÷) press.
 * @param {string} op
 */
function handleOperator(op) {
  const current = parseFloat(state.currentValue);

  if (state.operator && state.waitingForNext) {
    // User changed operator before entering a second number
    state.operator = op;
    setExpression(`${formatNumber(state.previousValue)} ${op}`);
    setActiveOperator(op);
    return;
  }

  if (state.previousValue !== null && !state.justEvaluated) {
    // Chain: evaluate pending operation first
    try {
      const result = calculate(state.previousValue, current, state.operator);
      const formatted = formatNumber(result);
      setResult(formatted);
      animatePop();
      setExpression(`${formatted} ${op}`);
      state.currentValue  = formatted;
      state.previousValue = result;
    } catch (e) {
      showError(e.message === "Division by zero" ? "Div by Zero" : "Error");
      return;
    }
  } else {
    state.previousValue = current;
    setExpression(`${formatNumber(current)} ${op}`);
  }

  state.operator       = op;
  state.waitingForNext = true;
  state.justEvaluated  = false;
  setActiveOperator(op);
}

/**
 * Handle equals press — evaluate the pending operation.
 */
function handleEquals() {
  if (state.operator === null || state.previousValue === null) return;

  const current = parseFloat(state.currentValue);

  // Show full expression in the expression line
  setExpression(`${formatNumber(state.previousValue)} ${state.operator} ${formatNumber(current)} =`);

  try {
    const result = calculate(state.previousValue, current, state.operator);
    const formatted = formatNumber(result);
    setResult(formatted);
    animatePop();

    // Update state for potential further operations
    state.currentValue   = formatted;
    state.previousValue  = null;
    state.operator       = null;
    state.waitingForNext = false;
    state.justEvaluated  = true;
  } catch (e) {
    showError(e.message === "Division by zero" ? "Div by Zero" : "Error");
  }

  setActiveOperator(null);
}

/**
 * Handle Clear (AC / C) press.
 */
function handleClear() {
  resetState();
  setResult("0");
  setExpression("");
  setActiveOperator(null);
  resultEl.classList.remove("error");
}

/**
 * Handle +/− (toggle sign) press.
 */
function handleSign() {
  if (state.currentValue === "0" || state.currentValue === "Error") return;

  if (state.currentValue.startsWith("-")) {
    state.currentValue = state.currentValue.slice(1);
  } else {
    state.currentValue = "-" + state.currentValue;
  }

  setResult(state.currentValue);
}

/**
 * Handle % (percent) press — divides current value by 100.
 */
function handlePercent() {
  const value = parseFloat(state.currentValue);
  if (isNaN(value)) return;

  const result = value / 100;
  state.currentValue = formatNumber(result);
  setResult(state.currentValue);
}

/* ============================================================
   EVENT BINDING — BUTTON CLICKS
   ============================================================ */

allButtons.forEach(button => {
  button.addEventListener("click", () => {
    const { action, value } = button.dataset;

    switch (action) {
      case "digit":    handleDigit(value);    break;
      case "decimal":  handleDecimal();       break;
      case "operator": handleOperator(value); break;
      case "equals":   handleEquals();        break;
      case "clear":    handleClear();         break;
      case "sign":     handleSign();          break;
      case "percent":  handlePercent();       break;
    }
  });
});

/* ============================================================
   EVENT BINDING — KEYBOARD SUPPORT
   ============================================================ */

/**
 * Map keyboard keys to calculator actions.
 * @type {Object.<string, () => void>}
 */
const keyMap = {
  "0": () => handleDigit("0"),
  "1": () => handleDigit("1"),
  "2": () => handleDigit("2"),
  "3": () => handleDigit("3"),
  "4": () => handleDigit("4"),
  "5": () => handleDigit("5"),
  "6": () => handleDigit("6"),
  "7": () => handleDigit("7"),
  "8": () => handleDigit("8"),
  "9": () => handleDigit("9"),
  ".": () => handleDecimal(),
  ",": () => handleDecimal(),
  "+": () => handleOperator("+"),
  "-": () => handleOperator("−"),
  "*": () => handleOperator("×"),
  "/": () => handleOperator("÷"),
  "Enter":     () => handleEquals(),
  "=":         () => handleEquals(),
  "Backspace": () => handleBackspace(),
  "Escape":    () => handleClear(),
  "Delete":    () => handleClear(),
  "%":         () => handlePercent(),
};

/**
 * Handle backspace — delete the last character of current input.
 */
function handleBackspace() {
  if (state.waitingForNext || state.justEvaluated) return;

  if (state.currentValue.length === 1 ||
      (state.currentValue.length === 2 && state.currentValue.startsWith("-"))) {
    state.currentValue = "0";
  } else {
    state.currentValue = state.currentValue.slice(0, -1);
    // Clean up a trailing minus after full delete
    if (state.currentValue === "-") state.currentValue = "0";
  }

  setResult(state.currentValue);
}

document.addEventListener("keydown", event => {
  // Don't hijack browser shortcuts
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const handler = keyMap[event.key];
  if (handler) {
    event.preventDefault();
    handler();

    // Visual feedback: briefly highlight the matching button
    highlightKeyboardButton(event.key);
  }
});

/**
 * Visually press the button that matches a keyboard key.
 * @param {string} key
 */
function highlightKeyboardButton(key) {
  const keyToValue = {
    "+": "+", "-": "−", "*": "×", "/": "÷",
    "Enter": "=", "=": "=",
  };

  let btn = null;

  if (/^\d$/.test(key)) {
    btn = document.querySelector(`[data-action="digit"][data-value="${key}"]`);
  } else if (key === "." || key === ",") {
    btn = document.querySelector(`[data-action="decimal"]`);
  } else if (keyToValue[key]) {
    const v = keyToValue[key];
    btn = document.querySelector(`[data-value="${v}"]`) ||
          document.querySelector(`[data-action="equals"]`);
  } else if (key === "Escape" || key === "Delete") {
    btn = document.querySelector(`[data-action="clear"]`);
  } else if (key === "Backspace") {
    // No dedicated button, skip
    return;
  }

  if (btn) {
    btn.classList.add("keyboard-active");
    setTimeout(() => btn.classList.remove("keyboard-active"), 120);
  }
}

/* ============================================================
   KEYBOARD ACTIVE STYLE (injected so it matches btn:active)
   ============================================================ */
const style = document.createElement("style");
style.textContent = `.btn.keyboard-active { transform: scale(0.93); filter: brightness(1.2); }`;
document.head.appendChild(style);

/* ============================================================
   INIT
   ============================================================ */
setResult("0");
setExpression("");
