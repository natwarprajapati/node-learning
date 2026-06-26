import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { tokenBlacklist } from "../controllers/auth.controller.js";

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Please login",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json(ApiResponse(401, "Invalid authorization header format"));
  }

  // Check if token is blacklisted
  if (tokenBlacklist.has(token)) {
    return res
      .status(401)
      .json(ApiResponse(401, "Token has been revoked. Please login again"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(ApiResponse(401, "Invalid authorization Token"));
  }
};
