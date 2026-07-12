import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Google profile se data nikalna
        const email = profile.emails[0].value;
        const userName = profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
        const firstName = profile.name.givenName || "First";
        const lastName = profile.name.familyName || "Last";
        const profileImg = profile.photos[0].value;

        // Check karo database mein user pehle se hai ya nahi
        let user = await userModel.findOne({ email });

        if (!user) {
          // Agar user nahi hai toh naya banao
          user = await userModel.create({
            userName,
            email,
            firstName,
            lastName,
            profileImg,
            password: "google-auth-protected-account", // Dummy password kyuki ye OAuth se aa raha hai
          });
        }

        return done(null, user); // User mil gaya ya ban gaya, ab aage badho
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;