import { validationResult } from "express-validator";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * Format success response
 */
export const successResponse = (
  res,
  message,
  data = null,
  statusCode = HTTP_STATUS.OK,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Format error response
 */
export const errorResponse = (
  res,
  message,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Get validation errors from express-validator
 */
export const getValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array().map((err) => err.msg);
  }
  return null;
};

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Generate JWT expiry time
 */
export const getTokenExpiry = (expiresIn = "7d") => {
  const timeMap = {
    "7d": 7 * 24 * 60 * 60,
    "1d": 24 * 60 * 60,
    "30d": 30 * 24 * 60 * 60,
  };
  return timeMap[expiresIn] || 7 * 24 * 60 * 60;
};

/**
 * Paginate query
 */
export const getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};

/**
 * Generate slug from string
 */
export const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
