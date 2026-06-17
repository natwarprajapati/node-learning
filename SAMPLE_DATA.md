# Sample MongoDB Records

Insert these sample records into MongoDB for testing the API.

## Sample Users

```json
[
  {
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "$2b$10$...",
    "role": "admin",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "$2b$10$...",
    "role": "customer",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "$2b$10$...",
    "role": "customer",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]
```

**Note:** Use the Registration endpoint to create users with proper password hashing.

---

## Sample Categories

```json
[
  {
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and accessories",
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Clothing",
    "slug": "clothing",
    "description": "Men and women clothing",
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Books",
    "slug": "books",
    "description": "Physical and digital books",
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Home & Garden",
    "slug": "home-garden",
    "description": "Home and garden products",
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]
```

---

## Sample Products

```json
[
  {
    "title": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "description": "Latest Apple iPhone with advanced features, A17 Pro chip, and stunning camera system",
    "price": 999,
    "discountPrice": 899,
    "stock": 50,
    "images": [
      "https://via.placeholder.com/300x300?text=iPhone+15+Pro",
      "https://via.placeholder.com/300x300?text=iPhone+15+Pro+Back"
    ],
    "categoryId": ObjectId("category_id_here"),
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "title": "Samsung Galaxy S24",
    "slug": "samsung-galaxy-s24",
    "description": "Flagship Samsung smartphone with incredible display and AI features",
    "price": 899,
    "discountPrice": 799,
    "stock": 45,
    "images": [
      "https://via.placeholder.com/300x300?text=Samsung+S24",
      "https://via.placeholder.com/300x300?text=Samsung+S24+Back"
    ],
    "categoryId": ObjectId("category_id_here"),
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "title": "Sony WH-1000XM5 Headphones",
    "slug": "sony-wh-1000xm5-headphones",
    "description": "Premium noise-cancelling wireless headphones with superior sound quality",
    "price": 399,
    "discountPrice": 349,
    "stock": 30,
    "images": [
      "https://via.placeholder.com/300x300?text=Sony+Headphones"
    ],
    "categoryId": ObjectId("category_id_here"),
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "title": "The Great Gatsby",
    "slug": "the-great-gatsby",
    "description": "Classic novel by F. Scott Fitzgerald - A timeless masterpiece",
    "price": 12.99,
    "discountPrice": 10.99,
    "stock": 100,
    "images": [
      "https://via.placeholder.com/300x300?text=The+Great+Gatsby"
    ],
    "categoryId": ObjectId("books_category_id_here"),
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "title": "Cotton T-Shirt",
    "slug": "cotton-t-shirt",
    "description": "Comfortable 100% cotton t-shirt available in multiple colors",
    "price": 19.99,
    "discountPrice": 14.99,
    "stock": 200,
    "images": [
      "https://via.placeholder.com/300x300?text=Cotton+T-Shirt"
    ],
    "categoryId": ObjectId("clothing_category_id_here"),
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]
```

---

## Sample Orders

```json
[
  {
    "userId": ObjectId("user_id_here"),
    "products": [
      {
        "productId": ObjectId("product_id_here"),
        "quantity": 1,
        "price": 899
      }
    ],
    "totalAmount": 899,
    "orderStatus": "pending",
    "paymentStatus": "pending",
    "shippingAddress": "123 Main Street, New York, NY 10001",
    "notes": "Please deliver by morning",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "userId": ObjectId("user_id_here"),
    "products": [
      {
        "productId": ObjectId("product_id_here"),
        "quantity": 2,
        "price": 349
      },
      {
        "productId": ObjectId("product_id_here"),
        "quantity": 1,
        "price": 10.99
      }
    ],
    "totalAmount": 710.99,
    "orderStatus": "processing",
    "paymentStatus": "completed",
    "shippingAddress": "456 Oak Avenue, Los Angeles, CA 90001",
    "notes": "Standard delivery",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]
```

---

## How to Insert Sample Data

### Using MongoDB Compass:

1. Connect to MongoDB (mongodb://127.0.0.1:27017/ecommerce_db)
2. Create a new database: `ecommerce_db`
3. Create collections: `users`, `categories`, `products`, `orders`
4. Use the Import feature to insert JSON data

### Using MongoDB Shell:

```javascript
// Switch to database
use ecommerce_db

// Insert categories
db.categories.insertMany([
  {
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and accessories",
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
  // ... add more categories
])

// Insert products (remember to replace ObjectId with actual IDs)
db.products.insertMany([
  {
    "title": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "description": "Latest Apple iPhone with advanced features",
    "price": 999,
    "discountPrice": 899,
    "stock": 50,
    "images": ["image1.jpg", "image2.jpg"],
    "categoryId": ObjectId("category_id"),
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
  // ... add more products
])
```

---

## Important Notes

1. **Password Hashing**: Passwords in sample data are hashed with bcrypt. Use the registration endpoint to create users properly.
2. **ObjectId**: Replace `ObjectId("...")` with actual MongoDB ObjectIds from your collections.
3. **User Roles**: Users have roles: `admin` or `customer`. Default is `customer`.
4. **Product Status**: Can be `active`, `inactive`, or `out_of_stock`.
5. **Order Status**: Can be `pending`, `processing`, `shipped`, `delivered`, or `cancelled`.
6. **Category Slugs**: Automatically generated from category names (lowercase, hyphenated).
