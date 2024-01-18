import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  //   TODO: validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Field are required");
  }
  // TODO: check if users already exists with email
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser)
    throw new ApiError(409, "User with email or username already exists");
  // TODO: check for images avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.file?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Needed");
  }
  // TODO: upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar Needed");
  }
  // TODO: create entry in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // TODO: remove password form refresh token field
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // TODO: check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }
  // TODO: if created return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user created successfully"));
});

export { registerUser };
