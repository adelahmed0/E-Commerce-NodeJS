import mongoose from "mongoose";
import OrderStatus, { ORDER_STATUS_VALUES } from "../enums/orderStatus.js";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    max: [100, "Quantity must be at most 100"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    status: {
      type: String,
      enum: {
        values: ORDER_STATUS_VALUES,
        message: "Invalid status value",
      },
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
