import { body, validationResult } from "express-validator";

export const validateCreateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters"),

  body("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => {
      if (parseFloat(value) < 0) {
        throw new Error("Price cannot be negative");
      }
      return true;
    }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 5, max: 1000 })
    .withMessage("Description must be between 5 and 1000 characters"),

  body("countInStock")
    .notEmpty()
    .withMessage("Product stock count is required")
    .isInt({ min: 0, max: 1000 })
    .withMessage("Stock count must be between 0 and 1000"),

  // Custom validation for files (since they are in req.files)
  body("images").custom((value, { req }) => {
    if (!req.files || req.files.length === 0) {
      throw new Error("At least one product image is required");
    }
    return true;
  }),
];

export const validateUpdateProduct = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters"),

  body("category").optional().isMongoId().withMessage("Invalid category ID"),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => {
      if (parseFloat(value) < 0) {
        throw new Error("Price cannot be negative");
      }
      return true;
    }),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Description must be between 5 and 1000 characters"),

  body("countInStock")
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage("Stock count must be between 0 and 1000"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};
