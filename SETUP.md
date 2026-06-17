# E-Commerce Backend API Setup Instructions

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **MongoDB Compass** (optional, for GUI management)
- **Postman** (for API testing)

---

## Installation Steps

### 1. Clone or Navigate to Project

```bash
cd "d:\Navish\Node Js P\nodejs-initial-level"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:

- express
- mongoose
- jsonwebtoken
- bcrypt
- cors
- helmet
- morgan
- express-validator
- dotenv
- multer

### 3. Setup MongoDB

#### Option A: Local MongoDB (Recommended for Development)

**Windows:**

1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a Windows Service
4. Start MongoDB:
   ```bash
   mongod
   ```

**macOS:**

```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Compass (GUI Management)

1. Download from https://www.mongodb.com/products/compass
2. Install and run MongoDB Compass
3. Connect to `mongodb://127.0.0.1:27017`
4. Create database: `ecommerce_db`
5. Create collections: `users`, `categories`, `products`, `orders`

#### Option C: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env` file

### 4. Configure Environment Variables

Edit `.env` file in the project root:

```env
# DATABASE
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_db

# SERVER
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=*
```

**Important:** Change `JWT_SECRET` in production!

### 5. Verify Project Structure

```
nodejs-initial-level/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   └── helpers.js
│   ├── constants/
│   │   └── index.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
├── package-lock.json
├── API_DOCUMENTATION.md
├── POSTMAN_COLLECTION.json
├── SAMPLE_DATA.md
└── SETUP.md
```

---

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

**Expected output:**

```
========================================
Server is running successfully
========================================
Environment: development
Port: 5000
API Base URL: http://localhost:5000
MongoDB: mongodb://127.0.0.1:27017/ecommerce_db
========================================
```

### Production Mode

```bash
npm start
```

---

## Testing the API

### 1. Health Check

Open browser or use curl:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-06-11T10:30:00.000Z"
}
```

### 2. Using Postman

1. Open Postman
2. Import `POSTMAN_COLLECTION.json`
3. Set environment variables:
   - `token`: Your JWT token (from login)
   - `adminToken`: Admin JWT token
   - `categoryId`: Category ID from database
   - `productId`: Product ID from database
   - `orderId`: Order ID from database
4. Start making requests!

### 3. Using cURL

**Register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Products:**

```bash
curl http://localhost:5000/api/products?page=1&limit=10
```

---

## Insert Sample Data

### Method 1: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017`
3. Select `ecommerce_db` database
4. For each collection, click `ADD DATA` → `Import File`
5. Upload JSON data from `SAMPLE_DATA.md`

### Method 2: Using MongoDB Shell

1. Open terminal/command prompt
2. Connect to MongoDB:
   ```bash
   mongosh
   ```
3. Switch to database:
   ```javascript
   use ecommerce_db
   ```
4. Copy and paste commands from `SAMPLE_DATA.md`

---

## API Endpoints Overview

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Products

- `GET /api/products` - Get all products (with search, filter, sort)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order (Admin only)

---

## Common Issues & Solutions

### 1. MongoDB Connection Error

**Error:** `MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**

- Make sure MongoDB is running: `mongod` (Windows) or `brew services start mongodb-community` (macOS)
- Check MONGODB_URI in .env file
- Verify MongoDB is listening on port 27017

### 2. Port Already in Use

**Error:** `listen EADDRINUSE: address already in use :::5000`

**Solution:**

- Change PORT in .env file (e.g., `PORT=5001`)
- Or kill the process using the port:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - macOS/Linux: `lsof -ti:5000 | xargs kill -9`

### 3. JWT Token Errors

**Error:** `Invalid or expired token`

**Solution:**

- Check JWT_SECRET in .env matches between request and server
- Get a new token from login/register endpoint
- Add token to Authorization header: `Bearer <token>`

### 4. Validation Errors

**Error:** `Validation error: Email is required`

**Solution:**

- Check request body matches API documentation
- Ensure all required fields are provided
- Email format must be valid

### 5. ObjectId Cast Error

**Error:** `Cast to ObjectId failed for value "invalid-id"`

**Solution:**

- Use valid MongoDB ObjectId (24 characters hex string)
- Verify the ID exists in database

---

## Environment Variables Reference

| Variable    | Value                                    | Description                          |
| ----------- | ---------------------------------------- | ------------------------------------ |
| MONGODB_URI | `mongodb://127.0.0.1:27017/ecommerce_db` | MongoDB connection string            |
| PORT        | `5000`                                   | Server port                          |
| NODE_ENV    | `development`                            | Environment (development/production) |
| JWT_SECRET  | `your-secret-key`                        | Secret key for JWT signing           |
| JWT_EXPIRE  | `7d`                                     | JWT token expiration                 |
| CORS_ORIGIN | `*`                                      | CORS allowed origins                 |

---

## Database Collections Structure

### Users Collection

```json
{
  "name": "String",
  "email": "String (unique)",
  "password": "String (hashed)",
  "role": "admin | customer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Categories Collection

```json
{
  "name": "String",
  "slug": "String",
  "description": "String",
  "status": "active | inactive",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Products Collection

```json
{
  "title": "String",
  "slug": "String",
  "description": "String",
  "price": "Number",
  "discountPrice": "Number",
  "stock": "Number",
  "images": ["String"],
  "categoryId": "ObjectId",
  "status": "active | inactive | out_of_stock",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Orders Collection

```json
{
  "userId": "ObjectId",
  "products": [
    {
      "productId": "ObjectId",
      "quantity": "Number",
      "price": "Number"
    }
  ],
  "totalAmount": "Number",
  "orderStatus": "pending | processing | shipped | delivered | cancelled",
  "paymentStatus": "pending | completed | failed | refunded",
  "shippingAddress": "String",
  "notes": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Next Steps

1. **Insert Sample Data** - Use MongoDB Compass or shell to add sample data
2. **Test APIs** - Use Postman collection to test endpoints
3. **Create Admin User** - Register a user and manually update role to 'admin' in database
4. **Deploy** - Follow deployment guides for your hosting platform
5. **Implement Frontend** - Build frontend to consume this API

---

## Deployment Guides

### Heroku

1. Install Heroku CLI
2. Create `Procfile`: `web: npm start`
3. Deploy: `git push heroku main`

### AWS/DigitalOcean

1. Create Ubuntu server
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies: `npm install`
5. Start server: `npm start`

### Docker

```dockerfile
FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Set NODE_ENV to 'production'
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for sensitive data
- [ ] Regular security audits
- [ ] Keep dependencies updated: `npm audit`
- [ ] Use MongoDB user authentication
- [ ] Implement CORS properly

---

## Support & Troubleshooting

For detailed API documentation, see `API_DOCUMENTATION.md`

For sample Postman collection, see `POSTMAN_COLLECTION.json`

For sample MongoDB data, see `SAMPLE_DATA.md`

---

## License

ISC
