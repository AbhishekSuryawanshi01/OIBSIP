/**
 * routes/protectedRoutes.js
 * Example secured endpoints — require valid JWT to access
 */

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const UserStore = require("../models/userStore");

const router = express.Router();

// All routes in this file are protected
router.use(authMiddleware);

// ─── GET /api/protected/dashboard ───────────────────────────────────────────
router.get("/dashboard", (req, res) => {
  const user = UserStore.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  return res.status(200).json({
    success: true,
    message: `Welcome to your dashboard, ${user.username}!`,
    data: {
      user,
      stats: {
        loginTime: new Date().toISOString(),
        sessionActive: true,
        role: "member",
      },
    },
  });
});

// ─── GET /api/protected/profile ─────────────────────────────────────────────
router.get("/profile", (req, res) => {
  const user = UserStore.findById(req.user.id);
  return res.status(200).json({ success: true, user });
});

module.exports = router;
