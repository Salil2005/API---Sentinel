import { verifyToken } from "../modules/auth/auth.token.js";

export const authMiddleware = (req, res, next) => {
    try{
        const token = req.cookies?.authToken;

        if(!token){
            return res.status(401).json({   
                success: false,
                error: "Authentication required",
                code: 401,
            });
        } 
        
        const decoded = verifyToken(token);

        req.user = {
            id: decoded.sub,
        };

        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token",
            code: 401,
        });
    }
};