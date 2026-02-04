import * as orderService from "../services/order.service.js";
import { successResponse, errorResponse } from "../helpers/response.js";
import { ORDER_STATUS_VALUES } from "../enums/orderStatus.js";

export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(
      req.body.orderItems,
      req.auth.id,
    );
    return successResponse(res, 201, req.t("order.created"), order);
  } catch (error) {
    const clientErrors = [
      "order.noItems",
      "order.invalidItems",
      "order.invalidQuantity",
      "order.productsNotFound",
      "order.outOfStock",
    ];
    const statusCode = clientErrors.includes(error.message)
      ? 400
      : error.message === "order.productsNotFound"
        ? 404
        : 500;

    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("order.")
          ? error.message
          : "order.createFailed",
      ),
      error.message,
    );
  }
};

export const getOrders = async (req, res) => {
  try {
    const { page, per_page, search } = req.query;
    const result = await orderService.getOrders({
      userId: req.auth.id,
      isAdmin: req.auth.role === "admin",
      page: parseInt(page),
      perPage: parseInt(per_page),
      search,
    });

    return successResponse(res, 200, req.t("order.fetchedAll"), result);
  } catch (error) {
    return errorResponse(
      res,
      500,
      req.t("order.fetchAllFailed"),
      error.message,
    );
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.auth.id,
      req.auth.role,
    );
    return successResponse(res, 200, req.t("order.fetched"), order);
  } catch (error) {
    let statusCode = 500;
    if (error.message === "order.notFound") statusCode = 404;
    if (error.message === "order.unauthorizedView") statusCode = 403;

    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("order.")
          ? error.message
          : "order.fetchFailed",
      ),
      error.message,
    );
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id);
    return successResponse(res, 200, req.t("order.deleted"));
  } catch (error) {
    const statusCode = error.message === "order.notFound" ? 404 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("order.")
          ? error.message
          : "order.deleteFailed",
      ),
      error.message,
    );
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return errorResponse(res, 400, req.t("order.statusRequired"));
    if (!ORDER_STATUS_VALUES.includes(status)) {
      return errorResponse(
        res,
        400,
        req.t("order.invalidStatus", {
          statuses: ORDER_STATUS_VALUES.join(", "),
        }),
      );
    }

    const order = await orderService.updateOrderStatus(req.params.id, status);
    return successResponse(res, 200, req.t("order.updated"), order);
  } catch (error) {
    const statusCode = error.message === "order.notFound" ? 404 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("order.")
          ? error.message
          : "order.updateFailed",
      ),
      error.message,
    );
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.auth.id);
    return successResponse(res, 200, req.t("order.cancelled"), order);
  } catch (error) {
    let statusCode = 500;
    let messageKey = "order.cancelFailed";

    if (error.message === "order.notFound") {
      statusCode = 404;
      messageKey = "order.notFound";
    } else if (error.message === "order.unauthorizedCancel") {
      statusCode = 403;
      messageKey = "order.unauthorizedCancel";
    } else if (error.message.startsWith("order.cannotCancel_status_")) {
      statusCode = 400;
      const status = error.message.split("_").pop();
      return errorResponse(
        res,
        statusCode,
        req.t("order.cannotCancel", { status }),
      );
    }

    return errorResponse(res, statusCode, req.t(messageKey), error.message);
  }
};
