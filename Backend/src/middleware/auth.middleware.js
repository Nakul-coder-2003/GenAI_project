import jwt from "jsonwebtoken";
import { blocklistModel } from "../models/blocklist.model.js";

export const isAuthenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(400).json({ message: "Please login to access this" });
    }

    const isBlocklistToken = await blocklistModel.findOne({token:token})

    if(isBlocklistToken){
      return res.status(401).json({success:false,message:"This session has expired. Please login again."})
    }
    
    const decode = jwt.verify(token, process.env.JWT_SECERET);
    // console.log(decode)
    req.userId = decode.id;
    next();
  } catch (error) {
    console.log(`authentication error ${error}`);
    return res.status(400).json({message:"authenticate errro"})
  }
};
