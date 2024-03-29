const jwt = require("jsonwebtoken");

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Token not provided" });

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

module.exports = authenticateUser;
