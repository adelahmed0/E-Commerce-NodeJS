import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const createOrder = async (orderItems, userId) => {
  if (!orderItems || orderItems.length === 0 || !Array.isArray(orderItems)) {
    throw new Error("order.noItems");
  }

  for (const item of orderItems) {
    if (!item.product || !item.quantity) throw new Error("order.invalidItems");
    if (
      typeof item.quantity !== "number" ||
      item.quantity < 1 ||
      !Number.isInteger(item.quantity)
    ) {
      throw new Error("order.invalidQuantity");
    }
  }

  const productsIds = orderItems.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productsIds } });

  if (products.length !== productsIds.length) {
    throw new Error("order.productsNotFound");
  }

  const ordersItemsWithPrices = [];
  for (const item of orderItems) {
    const product = products.find((p) => p._id.toString() === item.product);
    if (product.countInStock < item.quantity) {
      throw new Error("order.outOfStock");
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
    user: userId,
    totalPrice,
  });

  const savedOrder = await newOrder.save();

  // Update product stock
  for (const item of ordersItemsWithPrices) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.quantity },
    });
  }

  return await Order.findById(savedOrder._id)
    .populate("user")
    .populate("items.product");
};

export const getOrders = async ({
  userId,
  isAdmin,
  page = 1,
  perPage = 5,
  search = "",
}) => {
  const skip = (page - 1) * perPage;
  const filter = {};

  if (!isAdmin) filter.user = userId;
  if (search) filter.$or = [{ status: { $regex: search, $options: "i" } }];

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate("user", "userName email")
    .populate("items.product", "title price images")
    .select("user items totalPrice status createdAt")
    .skip(skip)
    .limit(perPage);

  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / perPage);

  return {
    orders,
    pagination: {
      total_count: totalOrders,
      current_page: page,
      last_page: totalPages,
      per_page: perPage,
    },
  };
};

export const getOrderById = async (id, userId, userRole) => {
  const order = await Order.findById(id)
    .populate("user")
    .populate("items.product");

  if (!order) throw new Error("order.notFound");

  if (userRole !== "admin" && order.user._id.toString() !== userId.toString()) {
    throw new Error("order.unauthorizedView");
  }

  return order;
};

export const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new Error("order.notFound");
  return order;
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) throw new Error("order.notFound");
  return order;
};

export const cancelOrder = async (id, userId) => {
  const order = await Order.findById(id);
  if (!order) throw new Error("order.notFound");

  if (order.user.toString() !== userId.toString()) {
    throw new Error("order.unauthorizedCancel");
  }

  if (order.status === "shipped" || order.status === "delivered") {
    // We throw a technical error and let the controller handle translation with dynamic values if needed
    throw new Error(`order.cannotCancel_status_${order.status}`);
  }

  order.status = "cancelled";
  await order.save();

  // Return stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: item.quantity },
    });
  }

  return order;
};
