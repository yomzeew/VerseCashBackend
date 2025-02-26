// routes/auth.ts
import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import passport from "passport";
import { login, register, sendotp, verifyopt } from "../controllers/auth/AuthController";
import { tokenpassword } from "../middleware/auth";

const router = Router();

// -----------------------
// Google OAuth Routes
// -----------------------

// Step 1: Redirect user to Google Login Page with a dynamic redirect URL.
router.get("/google", (req:any, res: any, next: NextFunction) => {
  try {
    const redirectUrl = req.query.redirect_url as string | undefined;
    if (!redirectUrl) {
      return res.status(400).send("Missing redirect_url parameter");
    }

    // Explicitly cast the result of passport.authenticate to RequestHandler using unknown.
    const googleAuth = passport.authenticate("google", {
      scope: ["profile", "email"],
      state: JSON.stringify({ redirectUrl }),
    }) as unknown as RequestHandler;

    googleAuth(req, res, next);
  } catch (error: any) {
    next(error);
  }
});

// Step 2: Google callback route. Retrieve the redirect URL from state.
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    const { user, token } = req.user as { user: any; token: string };
    const stateString = req.query.state as string | undefined;
    const state = stateString ? JSON.parse(stateString) : {};
    const redirectUrl = state.redirectUrl || "biblequotation://auth/google/callback";

   return res.redirect(
      `${redirectUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  }
);

// -----------------------
// Facebook OAuth Routes
// -----------------------

// Step 1: Redirect user to Facebook Login Page with a dynamic redirect URL.
router.get("/facebook", (req:any, res:any, next: NextFunction) => {
  try {
    const redirectUrl = req.query.redirect_url as string | undefined;
    if (!redirectUrl) {
      return res.status(400).send("Missing redirect_url parameter");
    }

    // Explicitly cast the result of passport.authenticate to RequestHandler using unknown.
    const facebookAuth = passport.authenticate("facebook", {
      scope: ["email"],
      state: JSON.stringify({ redirectUrl }),
    }) as unknown as RequestHandler;

    facebookAuth(req, res, next);
  } catch (error: any) {
    next(error);
  }
});

// Step 2: Facebook callback route. Retrieve the redirect URL from state.
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req: Request, res: Response) => {
    const { user, token } = req.user as { user: any; token: string };
    const stateString = req.query.state as string | undefined;
    const state = stateString ? JSON.parse(stateString) : {};
    const redirectUrl = state.redirectUrl || "biblequotation://auth/facebook/callback";

    return res.redirect(
      `${redirectUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  }
);

// -----------------------
// Local Authentication Routes
// -----------------------
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req, res, next);
  } catch (error) {
    next(error);
  }
});
router.post('/sendotp', async (req: Request, res: Response) => {
  sendotp(req, res);
});
router.post('/verifyotp',
    (req: Request, res: Response,next:NextFunction)=>{tokenpassword(req,res,next)},
    (req: Request, res: Response)=>{verifyopt(req,res)

    })

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await register(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;
