import { stripe } from "../config/stripe.js";
import { orderModel } from "../models/order.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// 1. Payment Intent Create Karna Aur Pending Order Save Karna
export const createPaymentIntent = catchAsync(async (req, res, next) => {
    const { amount, productId } = req.body; // Frontend se amount (Rupees mein) aur product ID aayegi

    if (!amount) {
        return next(new AppError("Amount is required", 400));
    }

    // Stripe hamesha sabse choti currency unit (Cents/Paise) mein kaam karta hai.
    // Agar ₹500 ka payment hai, toh Stripe ko 500 * 100 = 50000 paise bhejne honge.
    const amountInPaise = Math.round(amount * 100);

    // Stripe par Payment Intent banao
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: "inr", // Indian Rupees
        metadata: {
            userId: req.userId, // Logged-in user ki ID metadata mein daal di
            productId: productId
        },
        payment_method_types: ["card"], // Abhi ke liye sirf card enable kar rahe hain test mode mein
    });

    // Database mein ek PENDING order record create kar lo tracking ke liye
    await orderModel.create({
        user: req.userId,
        amount: amount,
        stripePaymentIntentId: paymentIntent.id,
        status: "pending"
    });

    // Frontend ko client_secret bhej do taaki wo checkout popup khol sake
    res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret
    });
});

// 2. Stripe Webhook - Payment Success Hone Par Automatic Trigger Hoga
export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        // Stripe se aane wale real raw body aur signature ko verify karna
        event = stripe.webhooks.constructEvent(
            req.body, // Ye raw buffer hona chahiye
            sig,
            process.env.STRIPE_WEBHOOK_SECRET // Tumhare stripe dashboard se milega (Abhi test mode mein bypass bhi kar sakte hain)
        );
    } catch (err) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Agar payment successfully complete ho gayi hai
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        console.log(`💰 Payment Intent Succeeded for ID: ${paymentIntent.id}`);

        // Database mein jaakar Order ka status 'succeeded' kar do
        await orderModel.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id },
            { status: "succeeded" }
        );
    }

    // Stripe ko 200 OK response dena zaroori hai, nahi toh wo baar-baar hit karta rahega
    res.status(200).json({ received: true });
};