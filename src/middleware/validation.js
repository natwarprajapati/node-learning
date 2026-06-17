import { body, param, query, validationResult } from "express-validator";

/**
 * User Registration Validation
 */
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

/**
 * User Login Validation
 */
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Update Profile Validation
 */
export const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").optional().trim().isEmail().withMessage("Invalid email format"),
];

/**
 * Category Validation
 */
export const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("description").optional().trim(),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

/**
 * Product Validation
 */
export const validateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),
  body("categoryId")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
  body("status")
    .optional()
    .isIn(["active", "inactive", "out_of_stock"])
    .withMessage("Invalid status"),
];

/**
 * Order Validation
 */
export const validateOrder = [
  body("products")
    .notEmpty()
    .withMessage("Products are required")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),
  body("products.*.productId").isMongoId().withMessage("Invalid product ID"),
  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("totalAmount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),
  body("shippingAddress").optional().trim(),
];

/**
 * Validate ID parameter
 */
export const validateId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

/**
 * Validate pagination query
 */
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

/**
 * Validation Error Handler Middleware
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};
