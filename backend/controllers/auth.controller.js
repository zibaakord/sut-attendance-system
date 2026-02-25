const authService = require("../services/auth.service");
const { verifyToken } = require("../utils/token");

const login = async (req, res) => {
  const { identifier, password, role } = req.body || {};

  try {
    const result = await authService.login({ identifier, password, role });
    return res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: status === 500 ? "Server error" : error.message,
    });
  }
};

const me = (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token);
    return res.json({ user: payload });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { login, me };
