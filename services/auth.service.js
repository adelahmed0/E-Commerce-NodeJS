import User from "../models/user.model.js";
import { generateToken } from "../helpers/jwt.js";

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("auth.userExists");
  }

  const user = new User(userData);
  await user.save();
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("auth.invalidCredentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("auth.invalidCredentials");
  }

  const token = generateToken(user);
  return { user, token };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("auth.userNotFound");
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  if (updateData.email) {
    const existingUser = await User.findOne({
      email: updateData.email,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new Error("auth.emailExists");
    }
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("auth.userNotFound");
  }

  user.set(updateData);
  await user.save();
  return user;
};
