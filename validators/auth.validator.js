import { body, validationResult } from "express-validator";
import { VALID_ROLES } from "../enums/roles.js";

// Validation rules for registration
export const validateRegistration = [
  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.emailRequired"))
    .isEmail()
    .withMessage((value, { req }) => req.t("auth.invalidEmail"))
    .normalizeEmail(),

  // Password validation
  body("password")
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.passwordRequired"))
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.t("auth.passwordMinLength")),

  // Username validation
  body("userName")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.usernameRequired"))
    .isLength({ min: 3, max: 50 })
    .withMessage((value, { req }) => req.t("auth.usernameLength")),

  // City validation
  body("city")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.cityRequired"))
    .isLength({ min: 2, max: 100 })
    .withMessage((value, { req }) => req.t("auth.cityLength")),

  // Postal code validation
  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.postalCodeRequired"))
    .isLength({ min: 3, max: 20 })
    .withMessage((value, { req }) => req.t("auth.postalCodeLength")),

  // Address Line 1 validation
  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.address1Required"))
    .isLength({ min: 5, max: 200 })
    .withMessage((value, { req }) => req.t("auth.address1Length")),

  // Address Line 2 validation (optional)
  body("addressLine2")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage((value, { req }) => req.t("auth.address2Length")),

  // Phone number validation
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.phoneRequired"))
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage((value, { req }) => req.t("auth.invalidPhone"))
    .isLength({ min: 10, max: 20 })
    .withMessage((value, { req }) => req.t("auth.phoneLength")),

  // Role validation (optional, defaults to "user")
  body("role")
    .optional()
    .isIn(VALID_ROLES)
    .withMessage((value, { req }) =>
      req.t("auth.invalidRole", { roles: VALID_ROLES.join(", ") }),
    ),
];

// Validation rules for login
export const validateLogin = [
  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.emailRequired"))
    .isEmail()
    .withMessage((value, { req }) => req.t("auth.invalidEmail"))
    .normalizeEmail(),

  // Password validation
  body("password")
    .notEmpty()
    .withMessage((value, { req }) => req.t("auth.passwordRequired")),
];

// Validation rules for updating profile
export const validateUpdateProfile = [
  // Email validation (optional)
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage((value, { req }) => req.t("auth.invalidEmail"))
    .normalizeEmail(),

  // Username validation (optional)
  body("userName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage((value, { req }) => req.t("auth.usernameLength")),

  // City validation (optional)
  body("city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage((value, { req }) => req.t("auth.cityLength")),

  // Postal code validation (optional)
  body("postalCode")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage((value, { req }) => req.t("auth.postalCodeLength")),

  // Address Line 1 validation (optional)
  body("addressLine1")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage((value, { req }) => req.t("auth.address1Length")),

  // Address Line 2 validation (optional)
  body("addressLine2")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage((value, { req }) => req.t("auth.address2Length")),

  // Phone number validation (optional)
  body("phoneNumber")
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage((value, { req }) => req.t("auth.invalidPhone"))
    .isLength({ min: 10, max: 20 })
    .withMessage((value, { req }) => req.t("auth.phoneLength")),
];

// Middleware to handle validation errors
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
