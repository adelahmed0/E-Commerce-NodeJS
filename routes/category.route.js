const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/category.controller");

// POST /categories
router.post("/", createCategory);

// GET /categories
router.get("/", getCategories);

// DELETE /categories/:id
router.delete("/:id", deleteCategory);

// PUT /categories/:id
router.put("/:id", updateCategory);

module.exports = router;
