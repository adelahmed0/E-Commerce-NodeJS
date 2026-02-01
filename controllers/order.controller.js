import { successResponse, errorResponse } from "../helpers/response.js";
import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;
    const { auth: currentUser } = req;

    // validate order items
    if (!orderItems || orderItems.length === 0 || !Array.isArray(orderItems)) {
      return errorResponse(res, 400, "No order items provided");
    }
    successResponse(res, 201, "Order created successfully", order);
  } catch (error) {
    errorResponse(res, 500, "Failed to create order", error.message);
  }
};
