import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

const JWT_EXPIRES_IN = "7d";

export const generateToken = (userId) => {
    return jwt.sign({
        sub: userId.toString(),
    },
    env.JWT_SECRET,
    {
        expiresIn: JWT_EXPIRES_IN,
    }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};