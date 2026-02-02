import { body, validationResult } from "express-validator";

export const validateCreateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("product.titleRequired"))
    .isLength({ min: 3, max: 100 })
    .withMessage((value, { req }) => req.t("product.titleLength")),

  body("category")
    .notEmpty()
    .withMessage((value, { req }) => req.t("product.categoryRequired"))
    .isMongoId()
    .withMessage((value, { req }) => req.t("product.invalidCategory")),

  body("price")
    .notEmpty()
    .withMessage((value, { req }) => req.t("product.priceRequired"))
    .isNumeric()
    .withMessage((value, { req }) => req.t("product.priceNumber"))
    .custom((value) => {
      if (parseFloat(value) < 0) {
        throw new Error(req.t("product.priceNegative"));
      }
      return true;
    }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("product.descriptionRequired"))
    .isLength({ min: 5, max: 1000 })
    .withMessage((value, { req }) => req.t("product.descriptionLength")),

  body("countInStock")
    .notEmpty()
    .withMessage((value, { req }) => req.t("product.stockRequired"))
    .isInt({ min: 0, max: 1000 })
    .withMessage((value, { req }) => req.t("product.stockLimit")),

  // Custom validation for files (since they are in req.files)
  body("images").custom((value, { req }) => {
    if (!req.files || req.files.length === 0) {
      throw new Error(req.t("product.imageRequired"));
    }
    return true;
  }),
];

export const validateUpdateProduct = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage((value, { req }) => req.t("product.titleLength")),

  body("category")
    .optional()
    .isMongoId()
    .withMessage((value, { req }) => req.t("product.invalidCategory")),

  body("price")
    .optional()
    .isNumeric()
    .withMessage((value, { req }) => req.t("product.priceNumber"))
    .custom((value) => {
      if (parseFloat(value) < 0) {
        throw new Error(req.t("product.priceNegative"));
      }
      return true;
    }),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage((value, { req }) => req.t("product.descriptionLength")),

  body("countInStock")
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage((value, { req }) => req.t("product.stockLimit")),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: req.t("common.validationFailed"),
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};
