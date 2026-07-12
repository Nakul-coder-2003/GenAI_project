import {z} from "zod"

export const signupSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").regex(/[A-Z]/, "Needs uppercase"),
    ConfirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  }),
}).refine((data) => data.body.password === data.body.ConfirmPassword, {
    message : "Passwords do not match",
    path: ["body","ConfirmPassword"]
});


export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"), // Login mein length check nahi, bas required hona chahiye
  }),
});

export const otpSchema = z.object({
  body:z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(6,"OTP must be exactly 6 characters")
  })
})


