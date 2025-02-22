import passport from 'passport';
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import dotenv from 'dotenv';
import { generateToken } from '../../utils/jwt';
import User from '../../models/users';
import { Op } from 'sequelize'; // Import Op for OR condition

dotenv.config();

// Define Passport Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email'], // Request user email and name
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done) => {
      try {
        console.log(profile); // Debugging purposes

        const email = profile.emails?.[0]?.value || null;
        const facebookId = profile.id;

        // Check if user exists using OR condition (either facebookId or email)
        let user = await User.findOne({
          where: {
            [Op.or]: [{ facebookId }, { email }],
          },
        });

        if (!user) {
          user = await User.create({
            facebookId,
            fullname: profile.displayName || 'Unknown User',
            email, // Can be null if not provided
          });
        } else {
          // If the user exists but doesn't have a Facebook ID, update it
          if (!user.facebookId) {
            user.facebookId = facebookId;
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

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;
