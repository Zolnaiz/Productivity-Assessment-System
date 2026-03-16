const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = tokenFromHeader || req.query.token || null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "super-secret-key");
    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  return next();
};

module.exports = { authMiddleware, authorizeRoles };
