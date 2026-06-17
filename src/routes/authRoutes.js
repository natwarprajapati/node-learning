import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  handleValidationErrors,
} from "../middleware/validation.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", ...validateRegister, handleValidationErrors, register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post("/login", ...validateLogin, handleValidationErrors, login);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get("/profile", verifyToken, getProfile);

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put(
  "/profile",
  verifyToken,
  ...validateUpdateProfile,
  handleValidationErrors,
  updateProfile,
);

export default router;
