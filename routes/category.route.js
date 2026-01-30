const express = require("express");
const router = express.Router();
const { Category } = require("../models/category.model");

router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create({
      name: req.body.name,
    });
    return res.status(201).send(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
