import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Raw Authorization Header:", authHeader);

  // Check if header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  // Remove extra spaces and extract token
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  console.log("Extracted Token:", token);

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    console.log("Decoded Payload:", decoded);

    // Attach user ID to request for downstream handlers
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default userMiddleware;
