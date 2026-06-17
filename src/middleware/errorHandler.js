import { errorResponse } from "../utils/helpers.js";
import { HTTP_STATUS, API_MESSAGES } from "../constants/index.js";

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || API_MESSAGES.INTERNAL_SERVER_ERROR;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    message = messages.join(", ");
    return errorResponse(res, message, HTTP_STATUS.BAD_REQUEST);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    return errorResponse(res, message, HTTP_STATUS.CONFLICT);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    message = "Invalid ID format";
    return errorResponse(res, message, HTTP_STATUS.BAD_REQUEST);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    return errorResponse(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    return errorResponse(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  return errorResponse(res, message, statusCode);
};

/**
 * 404 Not Found Middleware
 */
export const notFound = (req, res) => {
  errorResponse(res, "Route not found", HTTP_STATUS.NOT_FOUND);
};
