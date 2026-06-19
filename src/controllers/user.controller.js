import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  const usersList = await User.find();

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Users fetched successfully",
    count: usersList.length,
    usersData: usersList,
  });
};
