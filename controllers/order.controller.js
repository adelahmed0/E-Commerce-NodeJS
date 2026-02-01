import { successResponse, errorResponse } from "../helpers/response.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;
    const { auth: currentUser } = req;

    // validate order items
    if (!orderItems || orderItems.length === 0 || !Array.isArray(orderItems)) {
      return errorResponse(res, 400, "No order items provided");
    }
    for (const item of orderItems) {
      if (!item.product || !item.quantity) {
        return errorResponse(res, 400, "Invalid order items");
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return errorResponse(res, 404, "Product not found");
      }

      if(typeof item.quantity !== "number" || item.quantity < 1){
        return errorResponse(res, 400, "Invalid quantity");
      }
      if(!Number.isInteger(item.quantity)){
        return errorResponse(res, 400, "Invalid quantity");
      }
    }
    successResponse(res, 201, "Order created successfully", order);
  } catch (error) {
    errorResponse(res, 500, "Failed to create order", error.message);
  }
};
