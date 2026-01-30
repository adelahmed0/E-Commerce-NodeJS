import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

// POST /categories
router.post("/", createCategory);

// GET /categories
router.get("/", getCategories);

// DELETE /categories/:id
router.delete("/:id", deleteCategory);

// PUT /categories/:id
router.put("/:id", updateCategory);

export default router;
