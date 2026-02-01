import Product from "../models/product.model.js";
import { successResponse, errorResponse } from "../helpers/response.js";
import { getFileUrl } from "../middleware/upload.middleware.js";

export const createProduct = async (req, res) => {
  try {
    let imagesUrls = [];
    if (req.files && req.files.length > 0) {
      imagesUrls = req.files.map((file) => getFileUrl(req, file.filename));
    }
    const newProduct = new Product({
      title: req.body.title,
      category: req.body.category,
      price: parseFloat(req.body.price),
      description: req.body.description,
      countInStock: parseInt(req.body.countInStock),
      images: imagesUrls,
    });
    const savedProduct = await newProduct.save();
    await savedProduct.populate("category");

    return successResponse(
      res,
      201,
      "Product created successfully",
      savedProduct,
    );
  } catch (error) {
    return errorResponse(res, 500, "Failed to create product", error.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const search = req.query.search;
    const categoryId = req.query.categoryId;

    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 5;
    const skip = (page - 1) * per_page;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (categoryId) {
      filter.category = categoryId;
    }
    const products = await Product.find(filter)
      .populate("category")
      .skip(skip)
      .limit(per_page);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / per_page);
    return successResponse(res, 200, "Products fetched successfully", {
      products,
      pagination: {
        total_count: totalProducts,
        current_page: page,
        last_page: totalPages,
        per_page: per_page,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch products", error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("category");
    if (!product) {
      return errorResponse(res, 404, "Product not found");
    }
    return successResponse(res, 200, "Product fetched successfully", product);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch product", error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return errorResponse(res, 404, "Product not found");
    }
    return successResponse(res, 200, "Product deleted successfully");
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete product", error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, 404, "Product not found");
    }

    const { title, category, price, description, countInStock } = req.body;
    const isReplacement = req.body.newImages === "true";

    let updateData = {
      title,
      category,
      price: price ? parseFloat(price) : undefined,
      description,
      countInStock: countInStock ? parseInt(countInStock) : undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) =>
        getFileUrl(req, file.filename),
      );

      if (isReplacement) {
        // Replace old images with new ones
        updateData.images = uploadedImages;
      } else {
        // Append new images to existing ones
        updateData.images = [...product.images, ...uploadedImages];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    ).populate("category");

    return successResponse(
      res,
      200,
      "Product updated successfully",
      updatedProduct,
    );
  } catch (error) {
    return errorResponse(res, 500, "Failed to update product", error.message);
  }
};
