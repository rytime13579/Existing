// allows for tokens to be created with cookies
import jwt from "jsonwebtoken"

// we want to create a token for the user
// we want to know which user is which

// token basically validates that the user can preform actions on the server

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId:userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}