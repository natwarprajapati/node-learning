import Product from "../models/Product.js";
import {
  successResponse,
  errorResponse,
  getPaginationParams,
} from "../utils/helpers.js";
import { HTTP_STATUS, API_MESSAGES } from "../constants/index.js";

/**
 * Get All Products
 */
export const getProducts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page,
      req.query.limit,
    );
    const { search, category, sort } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.categoryId = category;
    }

    // Build sort object
    let sortOption = { createdAt: -1 };
    if (sort === "price") {
      sortOption = { price: 1 };
    } else if (sort === "-price") {
      sortOption = { price: -1 };
    } else if (sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    const total = await Product.countDocuments(filter);

    return successResponse(
      res,
      API_MESSAGES.PRODUCTS_FETCHED,
      {
        products,
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
 * Get Product by ID
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return errorResponse(
        res,
        API_MESSAGES.PRODUCT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.PRODUCT_FETCHED,
      product,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create Product
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      images,
      status,
    } = req.body;

    const product = new Product({
      title,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      images,
      status,
    });

    await product.save();

    return successResponse(
      res,
      API_MESSAGES.PRODUCT_CREATED,
      product,
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update Product
 */
export const updateProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      images,
      status,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        discountPrice,
        stock,
        categoryId,
        images,
        status,
      },
      { new: true, runValidators: true },
    );

    if (!product) {
      return errorResponse(
        res,
        API_MESSAGES.PRODUCT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.PRODUCT_UPDATED,
      product,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Product
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return errorResponse(
        res,
        API_MESSAGES.PRODUCT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.PRODUCT_DELETED,
      null,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};
