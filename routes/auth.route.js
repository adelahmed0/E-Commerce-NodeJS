import express from "express";
import { register } from "../controllers/auth.controller.js";
import {
  validateRegistration,
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

export default router;
