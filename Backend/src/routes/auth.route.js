import express from "express"
import { forgetPassword, login, logout, resetPassword,signup, verifyOtp } from "../controllers/auth.controller.js";
import { isAuthenticate } from "../middleware/auth.middleware.js";
import { uploadFile } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, signupSchema } from "../validation/auth.validation.js";

const authRouter = express.Router();

authRouter.post("/signup",uploadFile.single("profileImg"),validate(signupSchema),signup);
authRouter.post("/login",validate(loginSchema),login);
authRouter.post("/logout",logout);
authRouter.post("/forgetPassword",forgetPassword);
authRouter.post("/resetPassword",resetPassword);
authRouter.post("/verifyOtp",verifyOtp);

export default authRouter;