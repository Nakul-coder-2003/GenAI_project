import express from "express"
import { forgetPassword, getAllUser, getloginUserInfo, login, logout, resetPassword, sendOtp, signup, verifyOtp } from "../controllers/auth.controller.js";
import { isAuthenticate } from "../middleware/auth.middleware.js";
import { uploadFile } from "../middleware/multer.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup",uploadFile.single("profileImg"),signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/forgetPassword",forgetPassword);
authRouter.post("/resetPassword",resetPassword);
authRouter.post("/verifyOtp",verifyOtp);

export default authRouter;