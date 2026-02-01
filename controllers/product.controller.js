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
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const products = await Product.find(filter).populate("category");
    return successResponse(res, 200, "Products fetched successfully", products);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch products", error.message);
  }
};
