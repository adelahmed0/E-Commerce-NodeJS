import Category from "../models/category.model.js";
import { successResponse, errorResponse } from "../helpers/response.js";

// POST /categories - Create a new category
export const createCategory = async (req, res) => {
  try {
    if (!req.body.name || req.body.name.trim().length < 3) {
      return errorResponse(
        res,
        400,
        "Category name must be at least 3 characters long",
      );
    }

    const newCategory = await Category.create({
      name: req.body.name,
    });

    return successResponse(
      res,
      201,
      "Category created successfully",
      newCategory,
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /categories - Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return successResponse(
      res,
      200,
      "Categories fetched successfully",
      categories,
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// DELETE /categories/:id - Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return errorResponse(res, 404, "Category not found");
    }

    return successResponse(res, 200, "Category deleted successfully", category);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// PUT /categories/:id - Update a category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true },
    );

    if (!category) {
      return errorResponse(res, 404, "Category not found");
    }

    return successResponse(res, 200, "Category updated successfully", category);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
