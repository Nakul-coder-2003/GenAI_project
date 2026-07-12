import express from "express"
import cookieParser from "cookie-parser"

//import routers
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import userProfileRouter from "./routes/userProfile.route.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import passport from "passport";

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//api
app.use("/api/auth",authRouter);
app.use("/api/post",postRouter);
app.use("/api/user",userProfileRouter)


app.use(passport.initialize())
// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;

