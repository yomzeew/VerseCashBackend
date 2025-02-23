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
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = require("passport-facebook");
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_1 = require("../../utils/jwt");
const users_1 = __importDefault(require("../../models/users"));
const sequelize_1 = require("sequelize"); // Import Op for OR condition
dotenv_1.default.config();
// Define Passport Facebook strategy
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email'], // Request user email and name
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log(profile); // Debugging purposes
        const email = ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || null;
        const facebookId = profile.id;
        // Check if user exists using OR condition (either facebookId or email)
        let user = yield users_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ facebookId }, { email }],
            },
        });
        if (!user) {
            user = yield users_1.default.create({
                facebookId,
                fullname: profile.displayName || 'Unknown User',
                email, // Can be null if not provided
            });
        }
        else {
            // If the user exists but doesn't have a Facebook ID, update it
            if (!user.facebookId) {
                user.facebookId = facebookId;
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
// Serialize user
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
// Deserialize user
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
