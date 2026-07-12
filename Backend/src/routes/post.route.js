import express from "express"
import { commentPost, deletePost, editPost, getAllPosts, getUserPosts, likePost, savedPost, uploadpost } from "../controllers/post.controller.js";
import { uploadFile } from "../middleware/multer.middleware.js";
import { isAuthenticate, restrictTo } from "../middleware/auth.middleware.js";
import { getAllPostsSchema, getUserPostsSchema } from "../validation/post.validation.js";
import { validate } from "../middleware/validate.middleware.js";

const postRouter = express.Router();

postRouter.use(isAuthenticate);

postRouter.post("/upload",uploadFile.single("media"),uploadpost);
postRouter.get("/getAllPosts",validate(getAllPostsSchema),getAllPosts);
postRouter.post("/like/:postId",likePost);
postRouter.post("/comment/:postId",commentPost);
postRouter.patch("/edit/:postId",editPost);
postRouter.delete("/delete/:postId",restrictTo("admin"),deletePost);
postRouter.get("/getUserPosts/:userId",validate(getUserPostsSchema),getUserPosts)
postRouter.get("/post-saved/:postId",savedPost);

export default postRouter;