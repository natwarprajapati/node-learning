import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/helpers.js";
import { HTTP_STATUS, API_MESSAGES } from "../constants/index.js";

/**
 * Verify JWT Token Middleware
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return errorResponse(res, "No token provided", HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(
      res,
      "Invalid or expired token",
      HTTP_STATUS.UNAUTHORIZED,
    );
  }
};

/**
 * Check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return errorResponse(res, API_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }
  next();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return errorResponse(
      res,
      API_MESSAGES.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }
  next();
};
