// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

// Category Status
export const CATEGORY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_OF_STOCK: "out_of_stock",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// API Messages
export const API_MESSAGES = {
  // Auth Messages
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  PROFILE_FETCHED: "Profile fetched successfully",
  PROFILE_UPDATED: "Profile updated successfully",

  // Category Messages
  CATEGORY_CREATED: "Category created successfully",
  CATEGORY_FETCHED: "Category fetched successfully",
  CATEGORIES_FETCHED: "Categories fetched successfully",
  CATEGORY_UPDATED: "Category updated successfully",
  CATEGORY_DELETED: "Category deleted successfully",

  // Product Messages
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_FETCHED: "Product fetched successfully",
  PRODUCTS_FETCHED: "Products fetched successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",

  // Order Messages
  ORDER_CREATED: "Order created successfully",
  ORDER_FETCHED: "Order fetched successfully",
  ORDERS_FETCHED: "Orders fetched successfully",
  ORDER_UPDATED: "Order updated successfully",
  ORDER_DELETED: "Order deleted successfully",

  // Error Messages
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "Email already exists",
  USER_NOT_FOUND: "User not found",
  CATEGORY_NOT_FOUND: "Category not found",
  PRODUCT_NOT_FOUND: "Product not found",
  ORDER_NOT_FOUND: "Order not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  VALIDATION_ERROR: "Validation error",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
