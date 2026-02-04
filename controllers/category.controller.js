import * as categoryService from "../services/category.service.js";
import { successResponse, errorResponse } from "../helpers/response.js";

export const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body.name);
    return successResponse(res, 201, req.t("category.created"), category);
  } catch (error) {
    const statusCode = error.message === "category.nameLength" ? 400 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("category.") ? error.message : "common.error",
      ),
      error.message,
    );
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    return successResponse(res, 200, req.t("category.fetched"), categories);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    return successResponse(res, 200, req.t("category.deleted"), category);
  } catch (error) {
    const statusCode = error.message === "category.notFound" ? 404 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("category.") ? error.message : "common.error",
      ),
      error.message,
    );
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body.name,
    );
    return successResponse(res, 200, req.t("category.updated"), category);
  } catch (error) {
    const statusCode = error.message === "category.notFound" ? 404 : 500;
    return errorResponse(
      res,
      statusCode,
      req.t(
        error.message.startsWith("category.") ? error.message : "common.error",
      ),
      error.message,
    );
  }
};
