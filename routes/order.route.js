import express from "express";
import { createOrder, getOrders,getOrderById } from "../controllers/order.controller.js";
import { adminAndUserAuth } from "../middleware/roles.middleware.js";

const router = express.Router();

router.post("/", adminAndUserAuth, createOrder);

router.get("/", adminAndUserAuth, getOrders);

router.get("/:id", adminAndUserAuth, getOrderById);

export default router;
