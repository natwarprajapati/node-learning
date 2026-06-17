import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {
  validateCategory,
  validateId,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validation.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route GET /api/categories
 * @desc Get all categories with pagination
 * @access Public
 */
router.get("/", ...validatePagination, handleValidationErrors, getCategories);

/**
 * @route GET /api/categories/:id
 * @desc Get category by ID
 * @access Public
 */
router.get("/:id", ...validateId, handleValidationErrors, getCategoryById);

/**
 * @route POST /api/categories
 * @desc Create new category (Admin only)
 * @access Private - Admin
 */
router.post(
  "/",
  verifyToken,
  isAdmin,
  ...validateCategory,
  handleValidationErrors,
  createCategory,
);

/**
 * @route PUT /api/categories/:id
 * @desc Update category (Admin only)
 * @access Private - Admin
 */
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  ...validateId,
  ...validateCategory,
  handleValidationErrors,
  updateCategory,
);

/**
 * @route DELETE /api/categories/:id
 * @desc Delete category (Admin only)
 * @access Private - Admin
 */
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  ...validateId,
  handleValidationErrors,
  deleteCategory,
);

export default router;
