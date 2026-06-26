import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Token blacklist to store logged out tokens
export const tokenBlacklist = new Set();

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

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json(ApiResponse(400, "user not found", false));
  }

  const isMatchedPassword = await bcrypt.compare(password, user.password);

  if (!isMatchedPassword) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid credentials",
    });
  }

  // generate token

  const token = user.getJWTToken();

  return res
    .status(200)
    .json(ApiResponse(200, "user logged in successfully", { user, token }));
};

export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json(ApiResponse(401, "No token provided", false));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(ApiResponse(401, "Invalid authorization header format", false));
    }

    // Add token to blacklist
    tokenBlacklist.add(token);

    return res
      .status(200)
      .json(ApiResponse(200, "Logged out successfully", true));
  } catch (error) {
    return res.status(500).json(ApiResponse(500, "Error during logout", false));
  }
};
