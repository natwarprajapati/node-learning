import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  validateProduct,
  validateId,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validation.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route GET /api/products
 * @desc Get all products with filtering, searching, and pagination
 * @query page, limit, search, category, sort
 * @access Public
 */
router.get("/", ...validatePagination, handleValidationErrors, getProducts);

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 * @access Public
 */
router.get("/:id", ...validateId, handleValidationErrors, getProductById);

/**
 * @route POST /api/products
 * @desc Create new product (Admin only)
 * @access Private - Admin
 */
router.post(
  "/",
  verifyToken,
  isAdmin,
  ...validateProduct,
  handleValidationErrors,
  createProduct,
);

/**
 * @route PUT /api/products/:id
 * @desc Update product (Admin only)
 * @access Private - Admin
 */
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  ...validateId,
  ...validateProduct,
  handleValidationErrors,
  updateProduct,
);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product (Admin only)
 * @access Private - Admin
 */
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  ...validateId,
  handleValidationErrors,
  deleteProduct,
);

export default router;
