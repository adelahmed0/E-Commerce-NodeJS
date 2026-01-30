const express = require("express");
const router = express.Router();
const { Category } = require("../models/category.model");

router.post("/", async (req, res) => {
  try {
    if (!req.body.name || req.body.name.trim() < 3) {
      return res
        .status(400)
        .json({ message: "Category name must be at least 3 characters long" });
    }
    const newCategory = await Category.create({
      name: req.body.name,
    });
    return res.status(201).send({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, data: [] });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).send({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, data: [] });
  }
});

module.exports = router;
