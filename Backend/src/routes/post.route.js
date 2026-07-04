import express from "express"
import { getAllPosts, uploadpost } from "../controllers/post.controller.js";
import { uploadFile } from "../middleware/multer.middleware.js";
import { isAuthenticate } from "../middleware/auth.middleware.js";

const postRouter = express.Router();

postRouter.post("/upload",uploadFile.single("media"),isAuthenticate,uploadpost);
postRouter.post("/getAllPosts",getAllPosts);
postRouter.post("/like/:postId",getAllPosts);
postRouter.post("/comment/:postId",getAllPosts);
postRouter.post("/delete/:postId",getAllPosts);

export default postRouter;