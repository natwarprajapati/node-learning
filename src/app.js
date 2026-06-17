import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

/**
 * Middleware Configuration
 */

// Security Middleware
// app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: "*",
    credentials: false,
  }),
);

// Logging Middleware
app.use(morgan("combined"));

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/**
 * Health Check Route
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/**
 * Welcome Route
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to E-Commerce Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      orders: "/api/orders",
      health: "/health",
    },
  });
});

/**
 * Error Handling Middleware
 */
app.use(notFound);
app.use(errorHandler);

export default app;
