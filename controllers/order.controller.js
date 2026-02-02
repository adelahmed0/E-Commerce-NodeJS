import { successResponse, errorResponse } from "../helpers/response.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ORDER_STATUS_VALUES } from "../enums/orderStatus.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;
    const { auth: currentUser } = req;

    // validate order items
    if (!orderItems || orderItems.length === 0 || !Array.isArray(orderItems)) {
      return errorResponse(res, 400, req.t("order.noItems"));
    }
    for (const item of orderItems) {
      if (!item.product || !item.quantity) {
        return errorResponse(res, 400, req.t("order.invalidItems"));
      }
      if (typeof item.quantity !== "number" || item.quantity < 1) {
        return errorResponse(res, 400, req.t("order.invalidQuantity"));
      }
      if (!Number.isInteger(item.quantity)) {
        return errorResponse(res, 400, req.t("order.invalidQuantity"));
      }
    }
    const productsIds = orderItems.map((item) => item.product);

    const products = await Product.find({ _id: { $in: productsIds } });
    if (products.length !== productsIds.length) {
      return errorResponse(res, 404, req.t("order.productsNotFound"));
    }

    const ordersItemsWithPrices = [];

    for (const item of orderItems) {
      const product = products.find(
        (product) => product._id.toString() === item.product,
      );
      if (product.countInStock < item.quantity) {
        return errorResponse(res, 400, req.t("order.outOfStock"));
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
    successResponse(res, 201, req.t("order.created"), order);
  } catch (error) {
    errorResponse(res, 500, req.t("order.createFailed"), error.message);
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
    successResponse(res, 200, req.t("order.fetchedAll"), {
      orders,
      pagination: {
        total_count: totalOrders,
        current_page: page,
        last_page: totalPages,
        per_page: per_page,
      },
    });
  } catch (error) {
    errorResponse(res, 500, req.t("order.fetchAllFailed"), error.message);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      return errorResponse(res, 404, req.t("order.notFound"));
    }

    const { auth: currentUser } = req;

    if (
      currentUser.id.toString() !== order.user._id.toString() &&
      currentUser.role !== "admin"
    ) {
      return errorResponse(res, 403, req.t("order.unauthorizedView"));
    }

    successResponse(res, 200, req.t("order.fetched"), order);
  } catch (error) {
    errorResponse(res, 500, req.t("order.fetchFailed"), error.message);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return errorResponse(res, 404, req.t("order.notFound"));
    }
    successResponse(res, 200, req.t("order.deleted"), order);
  } catch (error) {
    errorResponse(res, 500, req.t("order.deleteFailed"), error.message);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return errorResponse(res, 400, req.t("order.statusRequired"));
    }

    if (!ORDER_STATUS_VALUES.includes(status)) {
      return errorResponse(
        res,
        400,
        req.t("order.invalidStatus", {
          statuses: ORDER_STATUS_VALUES.join(", "),
        }),
      );
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!order) {
      return errorResponse(res, 404, req.t("order.notFound"));
    }

    successResponse(res, 200, req.t("order.updated"), order);
  } catch (error) {
    errorResponse(res, 500, req.t("order.updateFailed"), error.message);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { auth: currentUser } = req;

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse(res, 404, req.t("order.notFound"));
    }

    // Check ownership
    if (order.user.toString() !== currentUser.id.toString()) {
      return errorResponse(res, 403, req.t("order.unauthorizedCancel"));
    }

    // Check status
    if (order.status === "shipped" || order.status === "delivered") {
      return errorResponse(
        res,
        400,
        req.t("order.cannotCancel", { status: order.status }),
      );
    }

    order.status = "cancelled";
    await order.save();

    // Increment product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.quantity },
      });
    }

    successResponse(res, 200, req.t("order.cancelled"), order);
  } catch (error) {
    errorResponse(res, 500, req.t("order.cancelFailed"), error.message);
  }
};
