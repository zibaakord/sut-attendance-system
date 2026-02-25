const requireRole = (...allowedRoles) => {
  const roles = allowedRoles.map((role) => String(role).trim().toUpperCase());

  return (req, res, next) => {
    const userRole = String(req.user?.role || "").toUpperCase();
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
};

module.exports = requireRole;
