import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json(ApiResponse(400, "please enter name, email and password", false));
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json(ApiResponse(400, "Please provide a valid email", false));
  }

  // check user already Exits
  const userExits = await User.findOne({ email });
  if (userExits) {
    return res.status(409).json(ApiResponse(409, "user already exits!", false));
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json(ApiResponse(400, "password must be minium 6 letters", false));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password,
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return res
    .status(201)
    .json(ApiResponse(201, "user Register Successfully", true, userResponse));
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(ApiResponse(400, "please enter name, email and password", false));
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json(ApiResponse(400, "Please provide a valid email", false));
  }
};
