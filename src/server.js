import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Connect to Database
 */
connectDB();

/**
 * Start Server
 */
const server = app.listen(PORT, () => {
  console.log(`
    ========================================
    Server is running successfully
    ========================================
    Environment: ${NODE_ENV}
    Port: ${PORT}
    API Base URL: http://localhost:${PORT}
    MongoDB: ${process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce_db"}
    ========================================
  `);
});

/**
 * Handle Unhandled Promise Rejections
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

/**
 * Handle Process Termination
 */
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

export default server;
