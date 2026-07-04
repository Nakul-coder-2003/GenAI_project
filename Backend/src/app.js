import express from "express"
import cookieParser from "cookie-parser"

//import routers
import userRouter from "../src/routes/user.route.js"
import postRouter from "./routes/post.route.js";

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//api
app.use("/api/auth",userRouter);
app.use("/api/post",postRouter);

export default app;

