import mongoose from "mongoose";
import { toJSONPlugin } from "../helpers/mongoosePlugins.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Product title must be at least 3 characters"],
      maxlength: [100, "Product title cannot exceed 100 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [5, "Product description must be at least 5 characters"],
      maxlength: [1000, "Product description cannot exceed 1000 characters"],
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
    },
    countInStock: {
      type: Number,
      required: [true, "Product stock count is required"],
      min: [0, "Stock count cannot be negative"],
      max: [1000, "Stock count cannot exceed 1000 units"],
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 5,
        min: [1, "Rating must be at least 1 star"],
        max: [5, "Rating cannot exceed 5 stars"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Rating count cannot be negative"],
      },
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views count cannot be negative"],
    },
  },
  { timestamps: true },
);

productSchema.plugin(toJSONPlugin);

const Product = mongoose.model("Product", productSchema);

export default Product;
