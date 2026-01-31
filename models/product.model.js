import mongoose from "mongoose";
import { toJSONPlugin } from "../helpers/mongoosePlugins.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title must be at most 100 characters long"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 5 characters long"],
      maxlength: [1000, "Description must be at most 1000 characters long"],
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
    },
    countInStock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      max: [1000, "Stock cannot be more than 1000"],
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 5,
        min: [1, "Rating cannot be less than 1"],
        max: [5, "Rating cannot be more than 5"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Rating count cannot be less than 0"],
      },
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views count cannot be less than 0"],
    },
  },
  { timestamps: true },
);

productSchema.plugin(toJSONPlugin);

const Product = mongoose.model("Product", productSchema);

export default Product;
