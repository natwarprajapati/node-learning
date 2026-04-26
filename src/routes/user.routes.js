import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controllers.js";
import validate from "../middlewares/validate.middleware.js";
import { createUserSchema } from "../validations/user.validation.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/create-user", validate(createUserSchema), createUser);
router.delete("/delete-user/:id", deleteUser);
router.put("/update-user/:id", updateUser);
router.get("/:id", getUserById);

export default router;
