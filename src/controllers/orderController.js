import Order from "../models/Order.js";
import Product from "../models/Product.js";
import {
  successResponse,
  errorResponse,
  getPaginationParams,
} from "../utils/helpers.js";
import { HTTP_STATUS, API_MESSAGES } from "../constants/index.js";

/**
 * Get All Orders
 */
export const getOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page,
      req.query.limit,
    );

    let filter = {};

    // If user is not admin, only return their orders
    if (req.user.role !== "admin") {
      filter.userId = req.user.userId;
    }

    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    return successResponse(
      res,
      API_MESSAGES.ORDERS_FETCHED,
      {
        orders,
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
 * Get Order by ID
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(
        res,
        API_MESSAGES.ORDER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      order.userId.toString() !== req.user.userId
    ) {
      return errorResponse(
        res,
        "You are not authorized to view this order",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    return successResponse(
      res,
      API_MESSAGES.ORDER_FETCHED,
      order,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create Order
 */
export const createOrder = async (req, res, next) => {
  try {
    const { products, totalAmount, shippingAddress, notes } = req.body;

    // Validate products exist and have sufficient stock
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return errorResponse(
          res,
          `Product ${item.productId} not found`,
          HTTP_STATUS.NOT_FOUND,
        );
      }
      if (product.stock < item.quantity) {
        return errorResponse(
          res,
          `Insufficient stock for ${product.title}`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    const order = new Order({
      userId: req.user.userId,
      products,
      totalAmount,
      shippingAddress,
      notes,
    });

    await order.save();

    // Update product stock
    for (let item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    return successResponse(
      res,
      API_MESSAGES.ORDER_CREATED,
      order,
      HTTP_STATUS.CREATED,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update Order
 */
export const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, shippingAddress, notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(
        res,
        API_MESSAGES.ORDER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    // Check authorization (only admin or order owner can update)
    if (
      req.user.role !== "admin" &&
      order.userId.toString() !== req.user.userId
    ) {
      return errorResponse(
        res,
        "You are not authorized to update this order",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    // Update allowed fields
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (notes) order.notes = notes;

    await order.save();

    return successResponse(
      res,
      API_MESSAGES.ORDER_UPDATED,
      order,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Order
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(
        res,
        API_MESSAGES.ORDER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    // Check authorization (only admin can delete orders)
    if (req.user.role !== "admin") {
      return errorResponse(
        res,
        "Only admins can delete orders",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    // Restore product stock
    for (let item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    return successResponse(
      res,
      API_MESSAGES.ORDER_DELETED,
      null,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
};
