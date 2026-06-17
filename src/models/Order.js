import mongoose from "mongoose";
import { ORDER_STATUS, PAYMENT_STATUS } from "../constants/index.js";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    orderStatus: {
      type: String,
      enum: [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED,
      ],
      default: ORDER_STATUS.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: [
        PAYMENT_STATUS.PENDING,
        PAYMENT_STATUS.COMPLETED,
        PAYMENT_STATUS.FAILED,
        PAYMENT_STATUS.REFUNDED,
      ],
      default: PAYMENT_STATUS.PENDING,
    },
    shippingAddress: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Populate user and product details
orderSchema.pre(/^find/, function () {
  this.populate("userId", "name email").populate(
    "products.productId",
    "title price",
  );
});

export default mongoose.model("Order", orderSchema);
