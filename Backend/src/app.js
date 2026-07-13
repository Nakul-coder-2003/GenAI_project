import express from "express"
import cookieParser from "cookie-parser"
import path from "path";
import { fileURLToPath } from "url";

//import routers
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import userProfileRouter from "./routes/userProfile.route.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import passport from "passport";
import paymentRouter from "./routes/payment.route.js";
import { stripeWebhook } from "./controllers/payment.controller.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Webhook ko strictly raw body chahiye, isliye ise express.json() se pehle lagana mandatory hai
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//api
app.use("/api/auth",authRouter);
app.use("/api/post",postRouter);
app.use("/api/user",userProfileRouter)
app.use("/api/payment", paymentRouter);


app.use(passport.initialize())
// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;

