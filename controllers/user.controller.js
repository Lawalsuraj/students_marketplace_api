import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";

export const createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("User already exists", 400);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  res.status(201).json({
    success: true,
    data: user,
  });
};


// GET SINGLE USER (ADMIN)
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({
    success: true,
    data: user,
  });
};


// GET ALL USERS (ADMIN)
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};


// UPDATE USER (ADMIN)
export const UpdateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) throw new AppError("User not found", 404);

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
};


// DELETE USER (ADMIN)
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new AppError("User not found", 404);

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};