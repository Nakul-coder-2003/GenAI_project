import express from "express"
import cookieParser from "cookie-parser"

//import routers
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import userProfileRouter from "./routes/userProfile.route.js";


const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//api
app.use("/api/auth",authRouter);
app.use("/api/post",postRouter);
app.use("/api/user",userProfileRouter)

export default app;

