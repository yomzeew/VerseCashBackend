"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.ts
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const AuthController_1 = require("../controllers/auth/AuthController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// -----------------------
// Google OAuth Routes
// -----------------------
// Step 1: Redirect user to Google Login Page with a dynamic redirect URL.
router.get("/google", (req, res, next) => {
    try {
        const redirectUrl = req.query.redirect_url;
        if (!redirectUrl) {
            return res.status(400).send("Missing redirect_url parameter");
        }
        // Explicitly cast the result of passport.authenticate to RequestHandler using unknown.
        const googleAuth = passport_1.default.authenticate("google", {
            scope: ["profile", "email"],
            state: JSON.stringify({ redirectUrl }),
        });
        googleAuth(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
// Step 2: Google callback route. Retrieve the redirect URL from state.
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    const { user, token } = req.user;
    const stateString = req.query.state;
    const state = stateString ? JSON.parse(stateString) : {};
    const redirectUrl = state.redirectUrl || "biblequotation://auth/google/callback";
    return res.redirect(`${redirectUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
// -----------------------
// Facebook OAuth Routes
// -----------------------
// Step 1: Redirect user to Facebook Login Page with a dynamic redirect URL.
router.get("/facebook", (req, res, next) => {
    try {
        const redirectUrl = req.query.redirect_url;
        if (!redirectUrl) {
            return res.status(400).send("Missing redirect_url parameter");
        }
        // Explicitly cast the result of passport.authenticate to RequestHandler using unknown.
        const facebookAuth = passport_1.default.authenticate("facebook", {
            scope: ["email"],
            state: JSON.stringify({ redirectUrl }),
        });
        facebookAuth(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
// Step 2: Facebook callback route. Retrieve the redirect URL from state.
router.get("/facebook/callback", passport_1.default.authenticate("facebook", { session: false }), (req, res) => {
    const { user, token } = req.user;
    const stateString = req.query.state;
    const state = stateString ? JSON.parse(stateString) : {};
    const redirectUrl = state.redirectUrl || "biblequotation://auth/facebook/callback";
    return res.redirect(`${redirectUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
// -----------------------
// Local Authentication Routes
// -----------------------
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, AuthController_1.login)(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/sendotp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, AuthController_1.sendotp)(req, res);
}));
router.post('/verifyotp', (req, res, next) => { (0, auth_1.tokenpassword)(req, res, next); }, (req, res) => {
    (0, AuthController_1.verifyopt)(req, res);
});
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, AuthController_1.register)(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/forgotpassword', (req, res, next) => { (0, AuthController_1.forgotPassword)(req, res, next); });
router.post('/changepassword', (req, res, next) => { (0, auth_1.tokenpassword)(req, res, next); }, (req, res) => { (0, AuthController_1.verifypassword)(req, res); });
exports.default = router;
