import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    otp:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: '5m'
    }
},{timestamps:true})

export const otpModel = mongoose.model("Otp",otpSchema);

