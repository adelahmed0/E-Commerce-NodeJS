import express from "express";
import { createOrder, getOrders } from "../controllers/order.controller.js";
import { adminAndUserAuth } from "../middleware/roles.middleware.js";

const router = express.Router();

router.post("/", adminAndUserAuth, createOrder);
router.get("/", adminAndUserAuth, getOrders);

export default router;
