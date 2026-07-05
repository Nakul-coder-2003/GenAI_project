import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/token.js";
import { blocklistModel } from "../models/blocklist.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { otpModel } from "../models/otp.model.js";
import { generateAndSaveOtp } from "../utils/sendOtp.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password,firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Please fill all required details",
      });
    }
   
    let profileImg;
    if(req.file){
      profileImg = await uploadOnCloudinary(req.file.path);
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "Account already exists with this email address or username",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hash,
      firstName,
      lastName,
      profileImg
    });

    let token;
    try {
      token = generateToken(newUser._id);
    } catch (error) {
      console.log(`token error ${error}`);
    }

    res
      .cookie("token", token)
      .status(200)
      .json({ message: "user register successfully!" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    let token;
    try {
      token = generateToken(user._id);
    } catch (error) {
      console.log(`token error ${error}`);
    }

    res
      .cookie("token", token)
      .status(200)
      .json({
        message: "user login successfully!",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      await blocklistModel.create({ token });
    }

    res.clearCookie("token").json({message:"user logout successfully"});
  } catch (error) {
    console.log(error);
  }
};

export const forgetPassword = async(req,res)=>{
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    await generateAndSaveOtp(email);
    return res.status(200).json({ message: "Password reset OTP has been sent to your email" });
  } catch (error) {
    console.log(`forget password error ${error}`);
    return res.status(400).json({success:"false",message:"internal server error"})
  }
}

export const resetPassword = async(req,res)=>{
  try {
    const {email,newPassword} = req.body;

    if(!newPassword || newPassword.length < 6){
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword,salt);

    await userModel.findOneAndUpdate(
      {email},
      {password: hashPassword}
    )

    return res.status(200).json({success:true, message: "Password reset successfully. Please login." });

  } catch (error) {
    console.log(`reset password error ${error}`);
    return res.status(400).json({success:"false",message:"internal server error"})
  }
}

export const verifyOtp = async(req,res)=>{
  try {
    const {email, otp} = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and otp is required" });

    const otpRecord = await otpModel.findOne({email});
    if(!otpRecord || otpRecord.otp !== otp){
      return res.status(400).json({success:false, message:"Invalid or expired otp"})
    }
    
    await otpModel.deleteOne({email});
    await otpModel.save();

    return res.status(200).json({ message: "OTP verified successfully", isVerified: true });

  } catch (error) {
    console.log(`forget password error ${error}`);
    return res.status(400).json({success:"false",message:"internal server error"})
  }
}

