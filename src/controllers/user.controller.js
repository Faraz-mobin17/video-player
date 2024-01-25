import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(error, "Something went wrong ");
  }
};

const checkAvatar = (avatarLocalPath) => {
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Needed");
  }
};

const registerUser = asyncHandler(async ({ body, files }, res) => {
  const { username, email, fullname, password } = body;

  // Validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  // Check if users already exist with email or username
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Check for avatar
  const avatarLocalPath = files?.avatar[0]?.path;
  // const coverImageLocalPath = files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (files && Array.isArray(files.coverImage) && files.coverImage.length > 0) {
    coverImageLocalPath = files.coverImage[0].path;
  }
  checkAvatar(avatarLocalPath);

  // Upload avatar and cover image to Cloudinary in parallel
  const [avatar, coverImage] = await Promise.all([
    uploadOnCloudinary(avatarLocalPath),
    uploadOnCloudinary(coverImageLocalPath),
  ]);

  // Create entry in the database
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Remove password from refresh token field
  const createdUser = await User.findById(user._id)
    .lean()
    .select("-password -refreshToken");

  // Check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  // If created, return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async ({ body }, res) => {
  // take data from req body
  const { email, username, password } = body;
  // username or email
  if (!username || !email) {
    throw new ApiError(400, "User name or email is required");
  }
  // find the user if exists or not
  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!userExists) {
    throw new ApiError(404, "User does not exists");
  }
  // password check
  const isPasswordValid = await userExists.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password Incorrect");
  }
  // send access and refresh token to the user
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userExists._id
  );
  // send cookies
  const loggedInUser = await User.findById(userExists._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export { registerUser };
