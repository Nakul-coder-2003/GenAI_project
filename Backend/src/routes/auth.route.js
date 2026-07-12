import express from "express"
import { forgetPassword, login, logout, OauthController, resetPassword,signup, verifyOtp } from "../controllers/auth.controller.js";
import { isAuthenticate } from "../middleware/auth.middleware.js";
import { uploadFile } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, otpSchema, signupSchema } from "../validation/auth.validation.js";
import passport from "../config/passport.js";

const authRouter = express.Router();

authRouter.post("/signup",uploadFile.single("profileImg"),validate(signupSchema),signup);
authRouter.post("/login",validate(loginSchema),login);
authRouter.post("/logout",logout);
authRouter.post("/forgetPassword",forgetPassword);
authRouter.post("/resetPassword",resetPassword);
authRouter.post("/verifyOtp",validate(otpSchema),verifyOtp);

authRouter.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"], session: false }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  OauthController
)

export default authRouter;