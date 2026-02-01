import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { adminAndUserAuth } from "../middleware/roles.middleware.js";

const router = express.Router();

router.post("/", adminAndUserAuth, createOrder);

export default router;
