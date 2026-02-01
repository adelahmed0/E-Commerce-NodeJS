import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  handleUploadError,
  uploadMultipleImages,
} from "../middleware/upload.middleware.js";
import { adminAndUserAuth, adminAuth } from "../middleware/roles.middleware.js";
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

router.get("/", adminAndUserAuth, getProducts);

router.get("/:id", adminAndUserAuth, getProductById);

router.put(
  "/:id",
  adminAuth,
  uploadMultipleImages,
  handleUploadError,
  updateProduct,
);

router.delete("/:id", adminAuth, deleteProduct);

export default router;
