import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { EmailAlreadyExists } from "../errorsHandlers/emailAlreadyExits.js";
import { sendOtpOnMail } from "../utils/sendOtpOnEmail.ts";
import { otpSavedInRedis, verifyOtpInRedis } from "../redis/otpSavedInRedis.js";

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

  // const emailExists = await EmailAlreadyExists(User, email, res);
  // if (emailExists) return;

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

export const registerWithOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(ApiResponse(400, "please enter email", false));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await otpSavedInRedis(email, otp, 300);

    const mailResult = await sendOtpOnMail(email, otp);
    if (mailResult?.error) {
      return res.status(500).json(ApiResponse(500, mailResult.error, false));
    }

    return res
      .status(201)
      .json(ApiResponse(201, "Otp sent successfully on mail", true));
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json(ApiResponse(500, "Error sending OTP", false));
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const otp = String(req.body.otp || "").trim();

    if (!email || !otp) {
      return res
        .status(400)
        .json(ApiResponse(400, "please enter email and otp", false));
    }

    const isOtpValid = await verifyOtpInRedis(email, otp);

    if (!isOtpValid) {
      return res
        .status(400)
        .json(ApiResponse(400, "Otp is not valid or expired", false));
    }

    return res
      .status(200)
      .json(ApiResponse(200, "Otp verified successfully", true));
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res
      .status(500)
      .json(ApiResponse(500, "Internal server error", false));
  }
};
