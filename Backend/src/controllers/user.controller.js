import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/token.js";
import { blocklistModel } from "../models/blicklist.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

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

    res.clearCookie(token).json({message:"user logout successfully"});
  } catch (error) {
    console.log(error);
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json({
      message: "fatch all user1",
      users: users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getloginUserInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
      message: "User details fetched successfully",
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
