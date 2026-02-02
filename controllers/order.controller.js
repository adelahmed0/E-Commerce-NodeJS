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
      if (typeof item.quantity !== "number" || item.quantity < 1) {
        return errorResponse(res, 400, "Invalid quantity");
      }
      if (!Number.isInteger(item.quantity)) {
        return errorResponse(res, 400, "Invalid quantity");
      }
    }
    const productsIds = orderItems.map((item) => item.product);

    const products = await Product.find({ _id: { $in: productsIds } });
    if (products.length !== productsIds.length) {
      return errorResponse(res, 404, "Some products not found");
    }

    const ordersItemsWithPrices = [];

    for (const item of orderItems) {
      const product = products.find(
        (product) => product._id.toString() === item.product,
      );
      if (product.countInStock < item.quantity) {
        return errorResponse(res, 400, `This product is out of stock`);
      }
      ordersItemsWithPrices.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });
    }
    const totalPrice = ordersItemsWithPrices.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const newOrder = new Order({
      items: ordersItemsWithPrices,
      user: currentUser.id,
      totalPrice,
    });
    const savedOrder = await newOrder.save();

    // update product stock
    for (const item of ordersItemsWithPrices) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.quantity },
      });
    }

    const order = await Order.findById(savedOrder._id)
      .populate("user")
      .populate("items.product");
    successResponse(res, 201, "Order created successfully", order);
  } catch (error) {
    errorResponse(res, 500, "Failed to create order", error.message);
  }
};

export const getOrders = async (req, res) => {
  try {
    const { auth: currentUser } = req;
    const isAdmin = currentUser.role === "admin";

    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 5;
    const search = req.query.search || "";
    const skip = (page - 1) * per_page;

    const filter = {};
    if (!isAdmin) {
      filter.user = currentUser.id;
    }
    if (search) {
      filter.$or = [{ status: { $regex: search, $options: "i" } }];
    }
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "userName email")
      .populate("items.product", "title price images")
      .select("user items totalPrice status createdAt")
      .skip(skip)
      .limit(per_page);
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / per_page);
    successResponse(res, 200, "Orders fetched successfully", {
      orders,
      pagination: {
        total_count: totalOrders,
        current_page: page,
        last_page: totalPages,
        per_page: per_page,
      },
    });
  } catch (error) {
    errorResponse(res, 500, "Failed to fetch orders", error.message);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      return errorResponse(res, 404, "Order not found");
    }

    const { auth: currentUser } = req;

    if (
      currentUser.id.toString() !== order.user._id.toString() &&
      currentUser.role !== "admin"
    ) {
      return errorResponse(
        res,
        403,
        "You are not authorized to view this order",
      );
    }

    successResponse(res, 200, "Order fetched successfully", order);
  } catch (error) {
    errorResponse(res, 500, "Failed to fetch order", error.message);
  }
};
