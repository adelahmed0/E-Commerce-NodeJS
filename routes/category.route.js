import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { adminAuth } from "../middleware/roles.middleware.js";

const router = express.Router();

// POST /categories
router.post("/",adminAuth, createCategory);

// GET /categories
router.get("/", getCategories);

// DELETE /categories/:id
router.delete("/:id",adminAuth, deleteCategory);

// PUT /categories/:id
router.put("/:id",adminAuth, updateCategory);

export default router;
