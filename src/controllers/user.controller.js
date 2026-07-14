import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  const usersList = await User.find().select("+password");

  // usersList.password = 76767;

  const loggedUserId = await req.id;

  const loggedUser = await User.findOne({ loggedUserId });

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Users fetched successfully",
    count: usersList.length,
    usersData: usersList,
    loggedUser: loggedUser,
  });
};

export const getUserById = async (req, res) => {
  const { id } = req;

  const userDataById = await User.findOne({ id });
  return res.status(200).json({
    status: 200,
    success: true,
    message: "Users fetched successfully",
    usersData: userDataById,
  });
};
