import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/helpers.js";
import { HTTP_STATUS, API_MESSAGES } from "../constants/index.js";

/**
 * Generate JWT Token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" },
  );
};

/**
 * Register User
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(
        res,
        API_MESSAGES.EMAIL_EXISTS,
        HTTP_STATUS.CONFLICT,
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };

    return successResponse(
      res,
      API_MESSAGES.REGISTER_SUCCESS,
      userResponse,
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    if (typeof next === "function") {
      next(error);
    } else {
      return errorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
};

/**
 * Login User
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email (include password field)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(
        res,
        API_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return errorResponse(
        res,
        API_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };

    return successResponse(
      res,
      API_MESSAGES.LOGIN_SUCCESS,
      userResponse,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    if (typeof next === "function") {
      next(error);
    } else {
      return errorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
};

/**
 * Get User Profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return errorResponse(
        res,
        API_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.PROFILE_FETCHED,
      user,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    if (typeof next === "function") {
      next(error);
    } else {
      return errorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
};

/**
 * Update User Profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.userId;

    // Check if email already exists (if changing email)
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return errorResponse(
          res,
          API_MESSAGES.EMAIL_EXISTS,
          HTTP_STATUS.CONFLICT,
        );
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );

    if (!user) {
      return errorResponse(
        res,
        API_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.PROFILE_UPDATED,
      user,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    if (typeof next === "function") {
      next(error);
    } else {
      return errorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
};
