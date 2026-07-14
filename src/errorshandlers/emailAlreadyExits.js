import { ApiResponse } from "../utils/ApiResponse.js";

export const EmailAlreadyExists = async (Model, email, res) => {
  const user = await Model.findOne({ email });

  if (!user) return false;

  res
    .status(409)
    .json(
      ApiResponse(
        409,
        "This email already exists. Please try with a different email.",
        false,
      ),
    );

  return true;
};
