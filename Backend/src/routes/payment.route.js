import express from "express";
import { createPaymentIntent, stripeWebhook } from "../controllers/payment.controller.js";
import { isAuthenticate } from "../middleware/auth.middleware.js";

const paymentRouter = express.Router();

// Intent banane ke liye user ka logged-in hona zaroori hai
paymentRouter.post("/create-intent", isAuthenticate, createPaymentIntent);

export default paymentRouter;