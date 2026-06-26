import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);

export default router;
