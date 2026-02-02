import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { adminAndUserAuth, adminAuth } from "../middleware/roles.middleware.js";

const router = express.Router();

router.post("/", adminAndUserAuth, createOrder);

router.get("/", adminAndUserAuth, getOrders);

router.get("/:id", adminAndUserAuth, getOrderById);

router.delete("/:id", adminAuth, deleteOrder);

router.patch("/:id/change-status", adminAuth, updateOrderStatus);

export default router;
