import User from "../models/user.model.js";
import { generateToken } from "../helpers/jwt.js";
import { successResponse, errorResponse } from "../helpers/response.js";

// POST /auth/register - Register a new user
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      userName,
      city,
      postalCode,
      addressLine1,
      addressLine2,
      phoneNumber,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, "User with this email already exists");
    }

    // Create new user
    const user = new User({
      email,
      password,
      role,
      userName,
      city,
      postalCode,
      addressLine1,
      addressLine2,
      phoneNumber,
    });

    await user.save();

    return successResponse(
      res,
      201,
      "User created successfully",
      user.toJSON(),
    );
  } catch (error) {
    return errorResponse(res, 500, "Failed to create user", error.message);
  }
};

// POST /auth/login - Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    // Generate token
    const token = generateToken(user);

    return successResponse(res, 200, "Login successful", {
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to login", error.message);
  }
};
