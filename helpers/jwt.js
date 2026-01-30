import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jsonwebtoken.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
