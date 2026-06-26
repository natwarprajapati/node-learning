import express from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getUserById);

export default router;
