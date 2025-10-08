import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {ENV} from "../lib/env.js";
// this method ensures that the user is logged in and has a valid token before doing proceeding
export const protectRoute = async (req, res, next) => {
    try {
        // get token from cookies labeled "jwt" which is the name of our token
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized - No token provided"});
        // verify token with our api secret
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        // send error if decode failed
        if(!decoded) return res.status(401).json({message: "Unauthorized - Invalid Token"});
        // gets user from database 
        const user = await User.findById(decoded.userId).select("-password");
        // send error if user cannot be found in database from token 
        if(!user) return res.status(401).json({message: "Unauthorized - Invalid Token"});
        // add custom user field to the req
        
        req.user = user;

        next();

    } catch (error) {
        // error handling to avoid a total program crash
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({message: "Internal server error"});
    }
}