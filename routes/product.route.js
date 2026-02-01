import express from "express";
import { createProduct } from "../controllers/product.controller.js";
import { handleUploadError, uploadMultipleImages } from "../middleware/upload.middleware.js";
import { adminAuth } from "../middleware/roles.middleware.js";

const router = express.Router();

router.post("/", adminAuth, uploadMultipleImages,handleUploadError, createProduct);

export default router;
