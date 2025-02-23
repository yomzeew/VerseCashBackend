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
exports.login = exports.register = exports.getuser = void 0;
const users_1 = require("../../models/users");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loggers_1 = __importDefault(require("../../utils/loggers"));
const getuser = (req, res) => {
    return res.status(200).json({ message: "hello" });
};
exports.getuser = getuser;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, email, password } = req.body;
        const fullname = `${firstname} ${lastname}`;
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        // Validate password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include both letters and numbers.",
            });
        }
        // Check if the user exists
        const existingUser = yield users_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create new user
        const newUser = yield users_1.User.create({
            fullname,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser.id,
                facebookId: newUser.facebookId || null,
                googleId: newUser.googleId || null,
                email: newUser.email,
                fullname: newUser.fullname,
            },
        });
    }
    catch (error) {
        console.error("Error during registration:", error.message || error);
        next(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        // Check if user exists
        const user = yield users_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Compare passwords
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        loggers_1.default.info(user.id);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user.id,
                facebookId: user.facebookId,
                googleId: user.googleId,
                email: user.email,
                fullname: user.fullname,
            }, token,
        });
    }
    catch (error) {
        console.error("Error during login:", error.message || error);
        next(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.login = login;
