// allows for tokens to be created with cookies
import jwt from "jsonwebtoken"
import {ENV} from './env.js';

// we want to create a token for the user
// we want to know which user is which

// token basically validates that the user can preform actions on the server

const generateToken = (userId, res) => {

    const {JWT_SECRET} = process.env;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({userId:userId}, JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, // 7 days in MS
        httpOnly: true, //prevent XSS attacks: cross-site scripting 
        sameSite: "strict", // CSRF attacks
        //secure: ENV.NODE_ENV === "development" ? false : true, // i would love to have a secure cookie but we don't because we don't have an https server
        secure: false,
    });

    return token;
}

export default generateToken;

//1:17:17