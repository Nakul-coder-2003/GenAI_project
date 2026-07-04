import express from "express"
import { getAllUser, getloginUserInfo, login, logout, signup } from "../controllers/user.controller.js";
import { isAuthenticate } from "../middleware/auth.middleware.js";
import { uploadFile } from "../middleware/multer.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup",uploadFile.single("profileImg"),signup);
userRouter.post("/login",login);
userRouter.post("/logout",logout);
userRouter.get("/getAllUser",isAuthenticate,getAllUser);
userRouter.get("/getloginUser",isAuthenticate,getloginUserInfo);

export default userRouter;