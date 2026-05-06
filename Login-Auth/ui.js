/**
 * js/ui.js
 * Shared UI helpers: alerts, form states, password strength, toggles
 */

const UI = {
  /** Show / hide an alert banner */
  showAlert(el, type, message) {
    if (!el) return;
    el.className = `alert alert-${type} visible`;
    el.innerHTML = `<span>${type === "success" ? "✓" : "✕"}</span> ${message}`;
  },

  hideAlert(el) {
    if (el) el.className = "alert";
  },

  /** Set a button into loading state */
  setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.classList.add("loading");
      btn.disabled = true;
    } else {
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  },

  /** Show a field-level error */
  showFieldError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add("error");
    const err = inputEl.closest(".input-wrap")?.nextElementSibling;
    if (err && err.classList.contains("field-error")) {
      err.textContent = message;
      err.classList.add("visible");
    }
  },

  clearFieldErrors() {
    document.querySelectorAll(".form-input.error").forEach((el) => el.classList.remove("error"));
    document.querySelectorAll(".field-error.visible").forEach((el) => el.classList.remove("visible"));
  },

  /** Password visibility toggle */
  initPasswordToggle(toggleBtn, inputEl) {
    if (!toggleBtn || !inputEl) return;
    toggleBtn.addEventListener("click", () => {
      const show = inputEl.type === "password";
      inputEl.type = show ? "text" : "password";
      toggleBtn.textContent = show ? "🙈" : "👁";
    });
  },

  /** Password strength indicator */
  initPasswordStrength(inputEl, strengthEl, labelEl) {
    if (!inputEl || !strengthEl) return;
    inputEl.addEventListener("input", () => {
      const val = inputEl.value;
      const strength = UI._calcStrength(val);
      strengthEl.className = `strength-bar strength-${strength}`;
      const labels = ["", "Weak", "Fair", "Good", "Strong"];
      if (labelEl) {
        labelEl.textContent = val.length === 0 ? "" : labels[strength];
        labelEl.style.color = ["", "#f5365c", "#fb6340", "#ffc107", "#2dce89"][strength];
      }
    });
  },

  _calcStrength(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)  score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  },
};

window.UI = UI;
