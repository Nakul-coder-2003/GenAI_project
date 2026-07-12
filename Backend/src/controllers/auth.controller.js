import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/token.js";
import { blocklistModel } from "../models/blocklist.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { otpModel } from "../models/otp.model.js";
import { generateAndSaveOtp } from "../utils/sendOtp.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const signup = catchAsync(async (req, res, next) => {
  const { userName, email, password, firstName, lastName } = req.body;

  if (!userName || !email || !password || !firstName || !lastName) {
    return next(new AppError("Please fill all required details",400))
  }

  let profileImg;
  if (req.file) {
    profileImg = await uploadOnCloudinary(req.file.path);
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (isUserAlreadyExists) {
    return next(new AppError("Account already exists",400))
  }
  
  const hash = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    email,
    password: hash,
    firstName,
    lastName,
    profileImg,
  });

  const token = generateToken(newUser._id);

  res
    .cookie("token", token)
    .status(200)
    .json({ message: "user register successfully!" });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid user",400))
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError("Invalid crendials",400))
  }

  const token = generateToken(newUser._id);

  res
    .cookie("token", token)
    .status(200)
    .json({
      message: "user login successfully!",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
});

export const logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    await blocklistModel.create({ token });
  }

  res.clearCookie("token").json({ message: "user logout successfully" });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) return next(new AppError("user not found",400));

  await generateAndSaveOtp(email);
  return res
    .status(200)
    .json({ message: "Password reset OTP has been sent to your email" });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return next(new AppError("Invalid",400))
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);

  await userModel.findOneAndUpdate({ email }, { password: hashPassword });

  return res
    .status(200)
    .json({
      success: true,
      message: "Password reset successfully. Please login.",
    });
});

export const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and otp is required" });

  const otpRecord = await otpModel.findOne({ email });
  if (!otpRecord || otpRecord.otp !== otp) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired otp" });
  }

  await otpModel.deleteOne({ email });
  await otpModel.save();

  return res
    .status(200)
    .json({ message: "OTP verified successfully", isVerified: true });
});

export const OauthController = catchAsync(async(req,res,next) => {
  const token = generateToken(req.user._id);
  res
    .cookie("token", token)
    .redirect("http://localhost:3000/dashboard");
})
