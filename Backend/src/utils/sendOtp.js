import { otpModel } from "../models/otp.model.js";

export const generateAndSaveOtp = async (email) => {
  // 6 digit ka random number generate karein
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Database mein save ya update karein
  await otpModel.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );

  // Yahan Nodemailer ka code aayega jo email bhejega
  console.log(`Email sent to ${email} with OTP: ${otp}`);
  
  return otp;
};
