import express from "express"
import { isAuthenticate } from "../middleware/auth.middleware.js";
import { currUser, editProfile, getProfile, suggestUsers } from "../controllers/userProfile.controller.js";

const userProfileRouter = express.Router();

userProfileRouter.use(isAuthenticate);

userProfileRouter.get("/currUser",currUser)
userProfileRouter.get("/suggestUsers", suggestUsers)
userProfileRouter.get("/getProfile/:userName",getProfile)
userProfileRouter.patch("/editProfile",editProfile)
// userProfileRouter.patch("/follow/:targetUserId",isAuthenticate,)
// userProfileRouter.get("/followers/:userId",isAuthenticate,)
// userProfileRouter.get("/following/:userId",isAuthenticate,)
// userProfileRouter.get("/search?q=nakul",isAuthenticate,)

export default userProfileRouter;