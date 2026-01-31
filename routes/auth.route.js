import express from "express";
import { register, login, getProfile } from "../controllers/auth.controller.js";
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from "../validators/auth.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /auth/register - Register a new user
router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  register,
);

// POST /auth/login - Login user
router.post("/login", validateLogin, handleValidationErrors, login);

// GET /auth/profile - Get user profile
router.get("/profile", authMiddleware, getProfile);

export default router;
