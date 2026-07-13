import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // Rupees mein (e.g., 500)
    stripePaymentIntentId: { type: String, required: true }, // Stripe se jo ID aayegi (pi_1234...)
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const orderModel = mongoose.model("Order", orderSchema);
