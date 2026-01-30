import { body, validationResult } from "express-validator";

// Validation rules for registration
export const validateRegistration = [
  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  // Password validation
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // Username validation
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),

  // City validation
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("City must be between 2 and 100 characters"),

  // Postal code validation
  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Postal code must be between 3 and 20 characters"),

  // Address Line 1 validation
  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address Line 1 must be between 5 and 200 characters"),

  // Address Line 2 validation (optional)
  body("addressLine2")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address Line 2 must be less than 200 characters"),

  // Phone number validation
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage("Please provide a valid phone number")
    .isLength({ min: 10, max: 20 })
    .withMessage("Phone number must be between 10 and 20 characters"),

  // Role validation (optional, defaults to "user")
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
];

// Validation rules for login
export const validateLogin = [
  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  // Password validation
  body("password").notEmpty().withMessage("Password is required"),
];

// Middleware to handle validation errors
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
