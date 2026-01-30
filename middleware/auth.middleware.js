import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponse } from "../helpers/response.js";

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, 401, "Unauthorized");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.auth = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      userName: decoded.userName,
      phoneNumber: decoded.phoneNumber,
    };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, 401, "Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Token expired");
    }
    return errorResponse(res, 401, "Authentication failed");
  }
};
