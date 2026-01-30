import jwt from "jsonwebtoken";
import { errorResponse } from "../helpers/response.js";

// Public routes that don't require authentication
// Format: "METHOD:path"
const publicRoutes = [
  "POST:/api/auth/login",
  "POST:/api/auth/register",
  "GET:/api/categories",
];

/**
 * Authentication Middleware
 */
export const authMiddleware = async (req, res, next) => {
  const route = `${req.method}:${req.path}`;

  // Skip authentication for public routes
  if (publicRoutes.includes(route)) {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, 401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      userName: decoded.userName,
      phoneNumber: decoded.phoneNumber,
    };

    next();
  } catch (error) {
    return errorResponse(res, 401, "Unauthorized");
  }
};
