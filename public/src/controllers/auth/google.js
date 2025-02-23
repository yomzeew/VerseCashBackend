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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = require("../../models/users");
const jwt_1 = require("../../utils/jwt");
const sequelize_1 = require("sequelize"); // Import Op for OR condition
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || null;
        const googleId = profile.id;
        // Check if user exists using OR condition
        let user = yield users_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ googleId }, { email }],
            },
        });
        if (!user) {
            user = yield users_1.User.create({
                googleId,
                fullname: profile.displayName || 'Unknown User',
                email,
            });
        }
        else {
            // If user exists but doesn't have a Google ID, update it
            if (!user.googleId) {
                user.googleId = googleId;
                yield user.save();
            }
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
        return done(null, { user, token });
    }
    catch (error) {
        return done(error, null);
    }
})));
