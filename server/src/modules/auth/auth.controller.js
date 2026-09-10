import {User} from './user.model.js';
import { hashPassword , comparePassword } from './auth.service.js';
import { generateToken } from './auth.token.js';
import { authCookieOptions } from './auth.cookie.js';
import { env } from "../../config/env.js";

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.validate.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(409).json({
                success: false,
                error: "User with this email already exists",
                code: 409,
            }); 
        }

        const passwordHash = await hashPassword(password);

        const user = await User.create({
            email,
            passwordHash,
        });

        return res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                },
            },
        });
    }
    
    catch (error) {
        next(error);    
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.validate.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
                code: 401,
            });
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if(!isPasswordValid){
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
                code: 401,
            });
        }

        const token = generateToken(user._id);

        res.cookie("authToken", token, authCookieOptions);

        return res.status(200).json({
            success: true,
            data: { 
                user: {
                    id: user._id,
                    email: user.email,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return res.status(200).json({
        success: true,
        data:{
            message: "Logged out successfully",
        },
    });
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("_id email");

        if(!user) {
            return res.status(401).json({
                success: false,
                error: "User not found",
                code: 401,
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user: { 
                    id: user._id,
                    email: user.email,
                },
            },
        });
    }
    catch(error){
        next(error);
    }
};