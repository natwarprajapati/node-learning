import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { ApiResponse } from "./src/utils/ApiResponse.js";
import authRouter from "./src/routers/auth.routes.js";
import userRouter from "./src/routers/user.routes.js";
import { redisClient } from "./src/config/redis.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*", // Allow requests from any origin
    credentials: true, // Allow credentials (e.g., cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow specific HTTP
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  }),
);

//connect to mongooseDB

connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error.message);
  // In development, continue running but warn about database issues
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

// connect to redis
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis connected successfully");
    } else {
      console.log("Redis is already connected");
    }
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
};

connectRedis();

// client.on("connect", () => {
//   console.log("Redis Connection Successful");
// });

// client.on("error", () => {
//   console.log("Redis connaction failed ", error);
// });

// try {
//   await client.connect();
//   console.log("connected");
// } catch (error) {
//   console.log(error);
// }

// client.set("key", "value", (err, reply) => {
//   if (err) {
//     console.error("Error setting key in Redis:", err);
//   } else {
//     console.log("Key set successfully in Redis");
//   }
// });

// await client.set("name", "Natwar");

// const value = await client.get("name");

// console.log(value);

// Health Check endpoint

app.get("/api/v1/test", (req, res) => {
  res.status(200).json(
    ApiResponse(200, "Server is running", true, {
      timestamp: new Date().toISOString(),
    }),
  );
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Backend!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// server running
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
