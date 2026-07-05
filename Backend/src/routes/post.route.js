import express from "express"
import { commentPost, deletePost, editPost, getAllPosts, likePost, uploadpost } from "../controllers/post.controller.js";
import { uploadFile } from "../middleware/multer.middleware.js";
import { isAuthenticate } from "../middleware/auth.middleware.js";

const postRouter = express.Router();

postRouter.use(isAuthenticate);

postRouter.post("/upload",uploadFile.single("media"),uploadpost);
postRouter.get("/getAllPosts",getAllPosts);
postRouter.post("/like/:postId",likePost);
postRouter.post("/comment/:postId",commentPost);
postRouter.patch("/edit/:postId",editPost);
postRouter.delete("/delete/:postId",deletePost);
// postRouter.get("/getUserPosts/:userId",isAuthenticate,getUserPosts);

export default postRouter;