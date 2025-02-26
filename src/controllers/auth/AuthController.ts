import { Request, Response, NextFunction } from "express";
import { LoginRequestBody, Requestbodytype } from "../../../types/types";
import { User } from "../../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmailPassword } from "../../utils/sendEmail";
import crypto from "crypto";
import { VerifyTemplate } from "../../utils/emailtemplate";
import Log from "../../utils/loggers";

// Extend Express Request Type
interface CustomRequest extends Request {
  user?: { id: number; email: string };
  otpuser?: { otp: string; email: string };
}

export const getuser = (req: Request, res: Response) => {
  return res.status(200).json({ message: "hello" });
};

export const register = async (
  req: Request<{}, {}, Requestbodytype>,
  res: Response,
  next?: NextFunction
): Promise<Response> => {
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
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        facebookId:newUser.facebookId || null,
        googleId:newUser.googleId || null,
        email: newUser.email ,
        fullname: newUser.fullname,
        
      },
    });
  } catch (error: any) {
    console.error("Error during registration:", error.message || error);
    next(error)
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
export const sendotp = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('ok')
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Generate a JWT token containing the OTP and email
    const token = jwt.sign(
      { otp, email: email },
      process.env.JWT_SECRET || "default_secret", // Use a secure secret in production
      { expiresIn: "5m" }
    );

    // Email Subject and HTML Template
    const subject = "Password Reset Request";
    const htmltemplate = VerifyTemplate(otp);

    // Send the email
    const emailResult = await sendEmailPassword(email, subject, email, () => htmltemplate);
    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send email." });
    }

    // Return success response
    return res.status(200).json({ message: "OTP sent to your email.", token });
  } catch (error: any) {
    console.error("Error in forgotPassword:", error.message || error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
export const verifyopt = async (req: Request, res: Response) => {
  try {
    const otpjwt = req.otpuser?.otp
    const emailjwt = req.otpuser?.email
    const otp = req.body.otp
    const email = req.body.email
    console.log(emailjwt, otpjwt)

    if (otpjwt !== otp || email !== emailjwt) {
      return res.status(404).json({ message: "Invalid otp." });

    }

    return res.status(200).json({ message: "Email verify successfully." });
  } catch (error: any) {
    console.error("Error in forgotPassword:", error.message || error);
    return res.status(500).json({ message: "Internal Server Error." });

  }


}

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next:NextFunction
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    Log.info(user.id);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        facebookId:user.facebookId,
        googleId:user.googleId,
        email: user.email,
        fullname: user.fullname,
        
      },token,
    });
  } catch (error: any) {
    console.error("Error during login:", error.message || error);
    next(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
