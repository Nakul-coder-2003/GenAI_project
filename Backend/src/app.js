import express from "express"
import userRouter from "../src/routes/user.route.js"
import cookieParser from "cookie-parser"

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//api
app.use("/api/auth",userRouter);

export default app;

