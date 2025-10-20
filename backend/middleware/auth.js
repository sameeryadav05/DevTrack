const jwt = require("jsonwebtoken");
const { ExpressError } = require("../utils/ExpressError.js");

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    throw new ExpressError(401, "No token provided");
  }

  // Typical authHeader format: "Bearer <token>", extract the token part
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ExpressError(401, "No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ExpressError(403, "Invalid or expired token");
  }
};

module.exports = { auth };
