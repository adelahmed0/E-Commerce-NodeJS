import * as productService from "../services/product.service.js";
import { successResponse, errorResponse } from "../helpers/response.js";
import { getFileUrl } from "../middleware/upload.middleware.js";

export const createProduct = async (req, res) => {
  try {
    let imagesUrls = [];
    if (req.files && req.files.length > 0) {
      imagesUrls = req.files.map((file) => getFileUrl(req, file.filename));
    }

    const productData = {
      title: req.body.title,
      category: req.body.category,
      price: parseFloat(req.body.price),
      description: req.body.description,
      countInStock: parseInt(req.body.countInStock),
      images: imagesUrls,
    };

    const savedProduct = await productService.createProduct(productData);
    return successResponse(res, 201, req.t("product.created"), savedProduct);
  } catch (error) {
    return errorResponse(
      res,
      500,
      req.t("product.createFailed"),
      error.message,
    );
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, categoryId, page, per_page } = req.query;
    const result = await productService.getProducts({
      search,
      categoryId,
      page: parseInt(page),
      perPage: parseInt(per_page),
    });

    return successResponse(res, 200, req.t("product.fetchedAll"), result);
  } catch (error) {
    return errorResponse(
      res,
      500,
      req.t("product.fetchAllFailed"),
      error.message,
    );
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id, true);
    return successResponse(res, 200, req.t("product.fetched"), product);
  } catch (error) {
    const statusCode = error.message === "product.notFound" ? 404 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("product.")
          ? error.message
          : "product.fetchFailed",
      ),
      error.message,
    );
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    return successResponse(res, 200, req.t("product.deleted"));
  } catch (error) {
    const statusCode = error.message === "product.notFound" ? 404 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("product.")
          ? error.message
          : "product.deleteFailed",
      ),
      error.message,
    );
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, category, price, description, countInStock } = req.body;
    const isReplacement = req.body.newImages === "true";

    const updateData = {
      title,
      category,
      price: price ? parseFloat(price) : undefined,
      description,
      countInStock: countInStock ? parseInt(countInStock) : undefined,
    };

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) => getFileUrl(req, file.filename));
    }

    const updatedProduct = await productService.updateProduct(
      req.params.id,
      updateData,
      isReplacement,
      uploadedImages,
    );

    return successResponse(res, 200, req.t("product.updated"), updatedProduct);
  } catch (error) {
    const statusCode = error.message === "product.notFound" ? 404 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("product.")
          ? error.message
          : "product.updateFailed",
      ),
      error.message,
    );
  }
};
