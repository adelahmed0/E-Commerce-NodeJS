import Product from "../models/product.model.js";
import { successResponse, errorResponse } from "../helpers/response.js";



export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            title: req.body.title,
            category: req.body.category,
            price: parseFloat(req.body.price),
            description: req.body.description,
            countInStock: parseInt(req.body.countInStock),
        });
        const savedProduct = await newProduct.save();
        return successResponse(res, 201, "Product created successfully", savedProduct);
    } catch (error) {
        return errorResponse(res, 500, "Failed to create product", error.message);
    }
}