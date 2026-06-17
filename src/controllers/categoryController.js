import Category from "../models/Category.js";
import {
  successResponse,
  errorResponse,
  getPaginationParams,
} from "../utils/helpers.js";
import { HTTP_STATUS, API_MESSAGES } from "../constants/index.js";

/**
 * Get All Categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page,
      req.query.limit,
    );

    const categories = await Category.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Category.countDocuments();

    return successResponse(
      res,
      API_MESSAGES.CATEGORIES_FETCHED,
      {
        categories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Category by ID
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(
        res,
        API_MESSAGES.CATEGORY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.CATEGORY_FETCHED,
      category,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create Category
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const category = new Category({
      name,
      description,
      status,
    });

    await category.save();

    return successResponse(
      res,
      API_MESSAGES.CATEGORY_CREATED,
      category,
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update Category
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      { new: true, runValidators: true },
    );

    if (!category) {
      return errorResponse(
        res,
        API_MESSAGES.CATEGORY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.CATEGORY_UPDATED,
      category,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Category
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return errorResponse(
        res,
        API_MESSAGES.CATEGORY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.CATEGORY_DELETED,
      null,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};
