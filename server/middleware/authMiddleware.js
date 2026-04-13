const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET123");

    // ✅ USER ID
    req.user = decoded.id;

    // ✅ ROLE (MUHIIM 🔥)
    req.userRole = decoded.role;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};