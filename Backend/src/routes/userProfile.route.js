import express from "express"
import { isAuthenticate } from "../middleware/auth.middleware.js";
import { currUser, deleteAccount, editProfile, followHandler, getProfile, searchHandler, suggestUsers, updatePassword } from "../controllers/userProfile.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { getProfileSchema, searchUsersSchema } from "../validation/userProfile.validation.js";

const userProfileRouter = express.Router();

userProfileRouter.use(isAuthenticate);

userProfileRouter.get("/currUser",currUser)
userProfileRouter.get("/suggestUsers", suggestUsers)
userProfileRouter.get("/getProfile/:userName",validate(getProfileSchema),getProfile)
userProfileRouter.patch("/editProfile",editProfile)
userProfileRouter.patch("/follow/:targetUserId",followHandler)
userProfileRouter.get("/search",validate(searchUsersSchema),searchHandler);
userProfileRouter.post("/updatePassword",updatePassword);
userProfileRouter.post("/deleteAccount",deleteAccount);


export default userProfileRouter;