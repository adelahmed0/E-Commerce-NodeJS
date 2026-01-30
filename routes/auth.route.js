import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from "../validators/auth.validator.js";

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

export default router;
