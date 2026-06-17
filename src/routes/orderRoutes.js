import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import {
  validateOrder,
  validateId,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validation.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route GET /api/orders
 * @desc Get all orders (Admin sees all, users see their own)
 * @access Private
 */
router.get(
  "/",
  verifyToken,
  ...validatePagination,
  handleValidationErrors,
  getOrders,
);

/**
 * @route GET /api/orders/:id
 * @desc Get order by ID
 * @access Private
 */
router.get(
  "/:id",
  verifyToken,
  ...validateId,
  handleValidationErrors,
  getOrderById,
);

/**
 * @route POST /api/orders
 * @desc Create new order
 * @access Private
 */
router.post(
  "/",
  verifyToken,
  ...validateOrder,
  handleValidationErrors,
  createOrder,
);

/**
 * @route PUT /api/orders/:id
 * @desc Update order status
 * @access Private
 */
router.put(
  "/:id",
  verifyToken,
  ...validateId,
  handleValidationErrors,
  updateOrder,
);

/**
 * @route DELETE /api/orders/:id
 * @desc Delete order (Admin only)
 * @access Private - Admin
 */
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  ...validateId,
  handleValidationErrors,
  deleteOrder,
);

export default router;
