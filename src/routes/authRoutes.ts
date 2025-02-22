// routes/auth.ts
import { Router } from "express";
import passport from "passport";

const router = Router();

// ✅ Step 1: Redirect user to Google Login Page
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Step 2: Google redirects back after login, Passport processes user data
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), // Middleware runs `done(null, { user, token })`
  (req, res) => {
    // ✅ Passport attaches `{ user, token }` to `req.user`
    const { user, token } = req.user as { user: any; token: string };
    
    // ✅ Send response with user details & JWT token
    res.json({ message: "Login successful", user, token });
  }
);
router.get("/facebook", passport.authenticate('facebook', { scope: ['email'] }));

// Facebook Callback
router.get(
  "/facebook/callback",
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    const { user, token } = req.user as { user: any; token: string };
    
    // ✅ Send response with user details & JWT token
    res.json({ message: "Login successful", user, token });
  }
);

export default router;
