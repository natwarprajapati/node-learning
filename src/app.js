import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { Server as SocketServer } from "socket.io";
import connectDB from "./config/db.js";
import ApiResponse from "./utils/ApiResponse.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import homepageRouter from "./routes/homepage.routes.js";
import { registerChatSocket } from "./sockets/chat.socket.js";

dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  },
});

app.set("io", io);

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "chat.html"));
});

// Connect to MongoDB
connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error.message);
  // In development, continue running but warn about database issues
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

// Health check route
app.get("/api/v1/test", (req, res) => {
  res
    .status(200)
    .json(
      ApiResponse(
        200,
        { timestamp: new Date().toISOString() },
        "Server is running",
      ),
    );
});

// API Routes
app.use("/", homepageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

// Socket.IO realtime chat
registerChatSocket(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";
  const errorData =
    process.env.NODE_ENV === "development" ? err.stack : undefined;

  res.status(status).json(ApiResponse(status, null, message, false, errorData));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(ApiResponse(404, null, "Route not found", false));
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`\nServer is running on port : http://localhost:${PORT}`);
});

export default app;
