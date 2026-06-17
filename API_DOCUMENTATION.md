# E-Commerce Backend API Documentation

## Base URL

```
http://localhost:5000/api
```

## Table of Contents

1. [Authentication Module](#authentication-module)
2. [Category Module](#category-module)
3. [Product Module](#product-module)
4. [Order Module](#order-module)
5. [Response Format](#response-format)
6. [Error Handling](#error-handling)

---

## Authentication Module

### 1. Register User

**POST** `/auth/register`

**Description:** Register a new user account

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login User

**POST** `/auth/login`

**Description:** Login with email and password

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get User Profile

**GET** `/auth/profile`

**Authentication:** Required (Bearer Token)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "createdAt": "2024-06-11T10:30:00.000Z",
    "updatedAt": "2024-06-11T10:30:00.000Z"
  }
}
```

---

### 4. Update User Profile

**PUT** `/auth/profile`

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "customer",
    "createdAt": "2024-06-11T10:30:00.000Z",
    "updatedAt": "2024-06-11T10:35:00.000Z"
  }
}
```

---

## Category Module

### 1. Get All Categories

**GET** `/categories`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example:**

```
GET /categories?page=1&limit=10
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": {
    "categories": [
      {
        "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
        "name": "Electronics",
        "slug": "electronics",
        "description": "Electronic devices and accessories",
        "status": "active",
        "createdAt": "2024-06-11T10:30:00.000Z",
        "updatedAt": "2024-06-11T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### 2. Get Category by ID

**GET** `/categories/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Category fetched successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and accessories",
    "status": "active",
    "createdAt": "2024-06-11T10:30:00.000Z",
    "updatedAt": "2024-06-11T10:30:00.000Z"
  }
}
```

---

### 3. Create Category

**POST** `/categories`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "status": "active"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and accessories",
    "status": "active",
    "createdAt": "2024-06-11T10:30:00.000Z",
    "updatedAt": "2024-06-11T10:30:00.000Z"
  }
}
```

---

### 4. Update Category

**PUT** `/categories/:id`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "name": "Electronics Updated",
  "description": "Updated description",
  "status": "inactive"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "name": "Electronics Updated",
    "slug": "electronics-updated",
    "description": "Updated description",
    "status": "inactive",
    "createdAt": "2024-06-11T10:30:00.000Z",
    "updatedAt": "2024-06-11T10:35:00.000Z"
  }
}
```

---

### 5. Delete Category

**DELETE** `/categories/:id`

**Authentication:** Required (Admin only)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

---

## Product Module

### 1. Get All Products

**GET** `/products`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title/description
- `category` (optional): Filter by category ID
- `sort` (optional): Sort by price (price, -price) or latest

**Examples:**

```
GET /products?page=1&limit=10
GET /products?search=iphone
GET /products?category=64f5a3b1c2d4e5f6g7h8i9j0
GET /products?sort=price
GET /products?sort=-price
GET /products?search=phone&category=64f5a3b1c2d4e5f6g7h8i9j0&sort=price
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "products": [
      {
        "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
        "title": "iPhone 15 Pro",
        "slug": "iphone-15-pro",
        "description": "Latest Apple iPhone",
        "price": 999,
        "discountPrice": 899,
        "stock": 50,
        "images": ["image1.jpg", "image2.jpg"],
        "categoryId": {
          "_id": "64f5a3b1c2d4e5f6g7h8i9j1",
          "name": "Electronics",
          "slug": "electronics"
        },
        "status": "active",
        "createdAt": "2024-06-11T10:30:00.000Z",
        "updatedAt": "2024-06-11T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### 2. Get Product by ID

**GET** `/products/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "title": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "description": "Latest Apple iPhone with advanced features",
    "price": 999,
    "discountPrice": 899,
    "stock": 50,
    "images": ["image1.jpg", "image2.jpg"],
    "categoryId": {
      "_id": "64f5a3b1c2d4e5f6g7h8i9j1",
      "name": "Electronics",
      "slug": "electronics"
    },
    "status": "active",
    "createdAt": "2024-06-11T10:30:00.000Z",
    "updatedAt": "2024-06-11T10:30:00.000Z"
  }
}
```

---

### 3. Create Product

**POST** `/products`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "title": "iPhone 15 Pro",
  "description": "Latest Apple iPhone with advanced features",
  "price": 999,
  "discountPrice": 899,
  "stock": 50,
  "images": ["image1.jpg", "image2.jpg"],
  "categoryId": "64f5a3b1c2d4e5f6g7h8i9j1",
  "status": "active"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "title": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "description": "Latest Apple iPhone with advanced features",
    "price": 999,
    "discountPrice": 899,
    "stock": 50,
    "images": ["image1.jpg", "image2.jpg"],
    "categoryId": "64f5a3b1c2d4e5f6g7h8i9j1",
    "status": "active",
    "createdAt": "2024-06-11T10:30:00.000Z",
    "updatedAt": "2024-06-11T10:30:00.000Z"
  }
}
```

---

### 4. Update Product

**PUT** `/products/:id`

**Authentication:** Required (Admin only)

**Request Body:** (same as Create)

**Response (200 OK):** (same as Create)

---

### 5. Delete Product

**DELETE** `/products/:id`

**Authentication:** Required (Admin only)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

---

## Order Module

### 1. Get All Orders

**GET** `/orders`

**Authentication:** Required

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Note:** Customers see only their orders; Admins see all orders

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "orders": [
      {
        "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
        "userId": {
          "_id": "64f5a3b1c2d4e5f6g7h8i9j1",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "products": [
          {
            "_id": "64f5a3b1c2d4e5f6g7h8i9j2",
            "productId": {
              "_id": "64f5a3b1c2d4e5f6g7h8i9j3",
              "title": "iPhone 15 Pro",
              "price": 999
            },
            "quantity": 1,
            "price": 899
          }
        ],
        "totalAmount": 899,
        "orderStatus": "pending",
        "paymentStatus": "pending",
        "shippingAddress": "123 Main Street",
        "notes": "Please deliver by evening",
        "createdAt": "2024-06-11T10:30:00.000Z",
        "updatedAt": "2024-06-11T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### 2. Get Order by ID

**GET** `/orders/:id`

**Authentication:** Required

**Response (200 OK):** (same as orders list item)

---

### 3. Create Order

**POST** `/orders`

**Authentication:** Required

**Request Body:**

```json
{
  "products": [
    {
      "productId": "64f5a3b1c2d4e5f6g7h8i9j0",
      "quantity": 1
    },
    {
      "productId": "64f5a3b1c2d4e5f6g7h8i9j1",
      "quantity": 2
    }
  ],
  "totalAmount": 2795,
  "shippingAddress": "123 Main Street, City, State 12345",
  "notes": "Please deliver by evening"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "64f5a3b1c2d4e5f6g7h8i9j0",
    "userId": "64f5a3b1c2d4e5f6g7h8i9j1",
    "products": [...],
    "totalAmount": 2795,
    "orderStatus": "pending",
    "paymentStatus": "pending",
    "shippingAddress": "123 Main Street, City, State 12345",
    "notes": "Please deliver by evening",
    "createdAt": "2024-06-11T10:30:00.000Z",
    "updatedAt": "2024-06-11T10:30:00.000Z"
  }
}
```

---

### 4. Update Order

**PUT** `/orders/:id`

**Authentication:** Required

**Request Body:**

```json
{
  "orderStatus": "processing",
  "paymentStatus": "completed",
  "shippingAddress": "Updated address",
  "notes": "Order is being processed"
}
```

**Response (200 OK):** (same as Create)

---

### 5. Delete Order

**DELETE** `/orders/:id`

**Authentication:** Required (Admin only)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Order deleted successfully",
  "data": null
}
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Error Handling

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request/validation error
- `401 Unauthorized` - Authentication required or token invalid
- `403 Forbidden` - Insufficient permissions (not admin)
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**Token obtained from:**

- `/auth/register` - During registration
- `/auth/login` - During login

---

## User Roles

- **customer** - Default role, can view products/categories, create orders
- **admin** - Can manage categories and products, view all orders

---

## Important Notes

1. **Slugs** are automatically generated from names (lowercase, hyphenated)
2. **Stock** is automatically updated when orders are created/deleted
3. **Pagination** defaults: page=1, limit=10, max_limit=100
4. **Product Images** are stored as URLs in an array
5. **Order Status Flow**: pending → processing → shipped → delivered (or cancelled)
6. **Payment Status**: pending → completed → failed → refunded
7. **Passwords** are hashed with bcrypt (10 salt rounds)
8. **JWT** tokens expire after 7 days

---

## Sample MongoDB Records

See `SAMPLE_DATA.md` for sample data to insert into MongoDB.

---

## Support

For issues or questions, please refer to the setup instructions in `SETUP.md`.
