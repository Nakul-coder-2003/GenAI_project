import express from "express"
import { isAuthenticate } from "../middleware/auth.middleware.js";
import { currUser, editProfile, followersHandler, followHandler, followingHandler, getProfile, searchHandler, suggestUsers } from "../controllers/userProfile.controller.js";

const userProfileRouter = express.Router();

userProfileRouter.use(isAuthenticate);

userProfileRouter.get("/currUser",currUser)
userProfileRouter.get("/suggestUsers", suggestUsers)
userProfileRouter.get("/getProfile/:userName",getProfile)
userProfileRouter.patch("/editProfile",editProfile)
userProfileRouter.patch("/follow/:targetUserId",followHandler)
userProfileRouter.get("/followers/:userId", followersHandler)
userProfileRouter.get("/following/:userId",followingHandler)
userProfileRouter.get("/search",searchHandler)

export default userProfileRouter;