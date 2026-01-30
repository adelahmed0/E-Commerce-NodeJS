import express from "express";
import User from "../models/user.model.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, role, userName, city, postalCode, addressLine1, addressLine2, phoneNumber } = req.body;
    const user = await new User({ email, password, role, userName, city, postalCode, addressLine1, addressLine2, phoneNumber });
    await user.save();
    res.status(201).json({ success: true, message: "User created successfully", data: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create user", error: error.message });
  }
});

export default router;