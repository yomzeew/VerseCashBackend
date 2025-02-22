import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import { User } from "../../models/users";
import { generateToken } from "../../utils/jwt";
import { Op } from "sequelize"; // Import Op for OR condition

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        const googleId = profile.id;

        // Check if user exists using OR condition
        let user = await User.findOne({
          where: {
            [Op.or]: [{ googleId }, { email }],
          },
        });

        if (!user) {
          user = await User.create({
            googleId,
            fullname: profile.displayName || 'Unknown User',
            email,
          });
        } else {
          // If user exists but doesn't have a Google ID, update it
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
        }

        // Generate JWT token
        const token = generateToken({ id: user.id, email: user.email });

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
