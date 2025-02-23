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
const router = (0, express_1.Router)();
// ✅ Step 1: Redirect user to Google Login Page
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// ✅ Step 2: Google redirects back after login, Passport processes user data
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), // Middleware runs `done(null, { user, token })`
(req, res) => {
    // ✅ Passport attaches `{ user, token }` to `req.user`
    const { user, token } = req.user;
    // ✅ Send response with user details & JWT token
    // res.json({ message: "Login successful", user, token });
    // Instead of res.json(...)
    res.redirect(`biblequotation://auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
router.get("/facebook", passport_1.default.authenticate('facebook', { scope: ['email'] }));
// Facebook Callback
router.get("/facebook/callback", passport_1.default.authenticate('facebook', { session: false }), (req, res) => {
    const { user, token } = req.user;
    // ✅ Send response with user details & JWT token
    // res.json({ message: "Login successful", user, token });
    // Instead of res.json(...)
    res.redirect(`biblequotation://auth/facebook/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, AuthController_1.login)(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, AuthController_1.register)(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
