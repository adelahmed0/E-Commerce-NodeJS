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
      return errorResponse(res, 409, req.t("auth.userExists"));
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

    return successResponse(res, 201, req.t("auth.userCreated"), user.toJSON());
  } catch (error) {
    return errorResponse(res, 500, req.t("auth.createFailed"), error.message);
  }
};

// POST /auth/login - Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, req.t("auth.invalidCredentials"));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, req.t("auth.invalidCredentials"));
    }

    // Generate token
    const token = generateToken(user);

    return successResponse(res, 200, req.t("auth.loginSuccess"), {
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    return errorResponse(res, 500, req.t("auth.loginFailed"), error.message);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.auth.id).select("-password");
    if (!user) {
      return errorResponse(res, 404, req.t("auth.userNotFound"));
    }
    return successResponse(
      res,
      200,
      req.t("auth.profileFetched"),
      user.toJSON(),
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      req.t("auth.profileFetchFailed"),
      error.message,
    );
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.auth.id;
    const updateBody = req.body;

    if (updateBody.email) {
      const existingUser = await User.findOne({
        email: updateBody.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return errorResponse(res, 409, req.t("auth.emailExists"));
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, req.t("auth.userNotFound"));
    }
    user.set(updateBody);
    await user.save();
    return successResponse(
      res,
      200,
      req.t("auth.profileUpdated"),
      user.toJSON(),
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      req.t("auth.profileUpdateFailed"),
      error.message,
    );
  }
};
