
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import pool from "./src/config/database.js";
import productRouter from "./src/routes/product.route.js";
import reviewRouter from "./src/routes/review.route.js";
 
dotenv.config();
 
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const app = express();
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));
 
// Database connection middleware
app.use((req, res, next) => {
// req.db = pool;
next();
});
 
// Routes
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on port : ${PORT}`);
});
