import mongoose from "mongoose";
import { PRODUCT_STATUS } from "../constants/index.js";
import { generateSlug } from "../utils/helpers.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    status: {
      type: String,
      enum: [
        PRODUCT_STATUS.ACTIVE,
        PRODUCT_STATUS.INACTIVE,
        PRODUCT_STATUS.OUT_OF_STOCK,
      ],
      default: PRODUCT_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

// Generate slug before saving
productSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Populate category details
productSchema.pre(/^find/, function () {
  this.populate("categoryId", "name slug");
});

export default mongoose.model("Product", productSchema);
