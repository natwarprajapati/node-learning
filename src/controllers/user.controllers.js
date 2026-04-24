import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";

// CREATE
export const createUser = asyncHandler(async (req, res) => {
  const { name, age } = req.body;

  const user = await User.create({ name, age });

  //   if (!user) {
  //     const error = new Error("Failed to create user");
  //     error.statusCode = 409;
  //     throw error;
  //   }

  res.status(201).json(user);
});

// GET ALL
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.json(users);
});

// GET BY ID
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.json(user);
});

// DELETE
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: "User deleted", user });
});

// update User

export const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, age } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name) user.name = name;
  if (age) user.age = age;

  await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user,
  });
});

// local code setup
// ----------------------

// import { response } from "express";
// import { users } from "../data/users.js";
// import { asyncHandler } from "../../utils/asyncHandler.js";

// // GET all users
// const getUsers = (req, res) => {
//   res.json(users);
// };

// // GET user by ID
// const getUserById = asyncHandler(async (req, res) => {
//   const id = parseInt(req.params.id);

//   const user = users.find((u) => u.id === id);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.json(user);
// });

// // POST create user
// const createUser = asyncHandler(async (req, res) => {
//   const { name, age } = req.body;

//   // basic validation
//   if (!name || !age) {
//     return res.status(400).json({ message: "Name and age required" });
//   }

//   const newUser = {
//     id: users.length + 1,
//     name,
//     age,
//   };

//   users.push(newUser);

//   if (!newUser) {
//     return res.status(500).json({ message: "Failed to create user" });
//   }

//   res.status(201).json({
//     message: "User created successfully",
//     user: newUser,
//   });
// });

// // delete User

// const deleteUser = asyncHandler(async (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = users.findIndex((u) => u.id === id);

//   if (index === -1) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const deletedUser = users.splice(index, 1);

//   res.json({
//     message: "User deleted successfully",
//     user: deletedUser[0],
//   });
// });

// // update User

// const updateUser = asyncHandler(async (req, res) => {
//   const id = parseInt(req.params.id);
//   const { name, age } = req.body;
//   // basic validation
//   if (!name || !age) {
//     return res.status(400).json({ message: "Name and age required" });
//   }

//   const index = users.findIndex((u) => u.id === id);

//   if (index === -1) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   users[index] = { id, name, age };

//   res.json({
//     message: "User updated successfully",
//     user: users[index],
//   });
// });

// export { getUsers, getUserById, createUser, deleteUser, updateUser };
