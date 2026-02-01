import express from "express";
import { createProduct } from "../controllers/product.controller.js";
import {
  handleUploadError,
  uploadMultipleImages,
} from "../middleware/upload.middleware.js";
import { adminAuth } from "../middleware/roles.middleware.js";
import {
  validateCreateProduct,
  handleValidationErrors,
} from "../validators/product.validator.js";

const router = express.Router();

router.post(
  "/",
  adminAuth,
  uploadMultipleImages,
  handleUploadError,
  validateCreateProduct,
  handleValidationErrors,
  createProduct,
);

export default router;
