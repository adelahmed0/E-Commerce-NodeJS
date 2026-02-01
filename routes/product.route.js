import express from "express";
import { createProduct } from "../controllers/product.controller.js";
import { uploadMultipleImages } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", uploadMultipleImages, createProduct);

export default router;
