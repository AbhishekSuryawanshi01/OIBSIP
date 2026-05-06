/**
 * middleware/authMiddleware.js
 * Protects routes by validating the Bearer token in Authorization header
 */

const { verifyToken } = require("../config/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided. Access denied." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // attach user payload to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ success: false, message: "Invalid token." });
  }
}

module.exports = authMiddleware;
