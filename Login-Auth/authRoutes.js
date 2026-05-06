/**
 * routes/authRoutes.js
 * Handles /api/auth/* endpoints: register, login, refresh, logout
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");

const UserStore = require("../models/userStore");
const { signAccessToken, signRefreshToken, verifyToken } = require("../config/jwt");
const { validateRegister, validateLogin } = require("../middleware/validate");

const router = express.Router();

// Rate limiter: max 10 auth attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts. Try again later." },
});

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post("/register", authLimiter, validateRegister, async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (UserStore.exists(email.toLowerCase())) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = UserStore.create(email.toLowerCase(), username, hashedPassword);

    const accessToken = signAccessToken({ id: newUser.id, email: newUser.email, username: newUser.username });
    const refreshToken = signRefreshToken({ id: newUser.id });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("[Register Error]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = UserStore.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const { password: _, ...safeUser } = user;
    const accessToken = signAccessToken({ id: safeUser.id, email: safeUser.email, username: safeUser.username });
    const refreshToken = signRefreshToken({ id: safeUser.id });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("[Login Error]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ─── POST /api/auth/refresh ──────────────────────────────────────────────────
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "Refresh token required." });
  }

  try {
    const decoded = verifyToken(refreshToken);
    const user = UserStore.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    const newAccessToken = signAccessToken({ id: user.id, email: user.email, username: user.username });
    return res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired refresh token." });
  }
});

// ─── POST /api/auth/logout ───────────────────────────────────────────────────
// With stateless JWTs, logout is handled on the client by discarding the token.
// In production, use a token blacklist / Redis store.
router.post("/logout", (req, res) => {
  return res.status(200).json({ success: true, message: "Logged out. Please clear your token on the client." });
});

module.exports = router;
