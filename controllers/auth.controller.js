import User from "../models/user.model.js";

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
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
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

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user.toJSON(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};
