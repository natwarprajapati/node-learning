import mongoose from "mongoose";
import { CATEGORY_STATUS } from "../constants/index.js";
import { generateSlug } from "../utils/helpers.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [CATEGORY_STATUS.ACTIVE, CATEGORY_STATUS.INACTIVE],
      default: CATEGORY_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

// Generate slug before saving
categorySchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = generateSlug(this.name);
  }
  next();
});

export default mongoose.model("Category", categorySchema);
