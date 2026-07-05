import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:true,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: '5m'
    }
},{timestamps:true})

export const otpModel = mongoose.model("Otp",otpSchema);

