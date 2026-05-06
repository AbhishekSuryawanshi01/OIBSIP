/**
 * middleware/validate.js
 * Input validation helpers for auth routes
 */

function validateRegister(req, res, next) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ success: false, message: "Email, username, and password are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format." });
  }

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ success: false, message: "Username must be 3–30 characters." });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
  }

  // Basic password strength: at least one letter and one number
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ success: false, message: "Password must contain letters and numbers." });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  next();
}

module.exports = { validateRegister, validateLogin };
