import User from "../models/User.js";

import bcrypt from "bcrypt";

import generateToken from "../lib/utils.js";

import "dotenv/config";

import {sendWelcomeEmail} from "../emails/emailHandler.js";

import {ENV} from '../lib/env.js';

import cloudinary from "../lib/cloudinary.js";

import path from 'path';
import fs from 'fs';

//singup enpoint for api
export const signup = async (req,res) => {

    const {fullName, email, password} = req.body;

    try {

        //check if name, email and passowrd exists
        if (!fullName || !email || !password) {
            return res.status(400).json({message:"All Fields are required"});
        }
        //validate password length
        if (password.length < 6) {
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        //check if email is valid

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // finds user by email in database
        // user is extends mongoose and is in user.js
        const user = await User.findOne({email:email});
        // if user exists, send error message
        if(user) return res.status(400).json({message: "Email already exists"});

        // start password hashing and store password

        // create salt that is 10 characters long (every stored password will be this length)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create new user using the scheme we defined in User.js

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        //if new user was successfully created....
        if (newUser) {

            // function is defined by us here to generate a token
            // a token is a validated user and one that can be used for connecting to our service 
            
            // saves user to databse

            const savedUser = await newUser.save();
            generateToken(savedUser._id, res); 



            // sends created user to the requested endpoint
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
                
            });

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.error("Failed to send welcome email", error);
            }

        } else {
            res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
    
};
//login enpoint for the api
export const login = async (req, res) => {

    // get email and password user typed from the body of the post request
    const {email, password} = req.body;
    // trys to find the email 

    if (!email || !password) {
        return res.status(400).json(({message: "Email and password are required"}));
    }

    try {
        // find user in database
        const user = await User.findOne({email:email});
        // if email doe not exist, then we send "invalid credentials"
        // never tell the client which one is incorrect: password  or email
        if (!user) return res.status(400).json({message:"Invalid Credentials"});
        // use bcrypt to compare the plain text password to the salted/encrypted password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // return invalid credentials if password is incorrect 
        if (!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials"});
        // generate token using user._id and res field to respond with token
        generateToken(user._id, res);
        // sends user information back to client 
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
    });
    } catch (error) {
        console.error("Error in login controller: ", error);
        res.status(500).json({message: "Internal server error" });
    }  

};
// we don't need req here
export const logout = (_, res) => {
    // get the name of the cookie from utils.js (in our case jwt)
    // then kill the cookie by setting its max age to 0
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});
};
// allows user to update their image
// we will store images locally

export const updateProfile = async (req, res) => {
    try {   
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({message: "Profile picture is required"});
        // here we access our custome field from the auth middleware function
        const userId = req.user._id;
        
        // TODO: upload or store image here
        // imgUrl must be defined properly
        // currently we are using cloudinary which allows for 25 updated images / month, we will probably need to scale this locally soon
        // const imgUrl = await cloudinary.uploader.upload(profilePic);

        // ----------------storing image to local folder ------------

        const matches = profilePic.match(/^data:(.+);base64,(.+)$/);
        if (!matches) return res.status(400).json({ message: "Invalid image format" });

        const mimeType = matches[1];
        const base64Data = matches[2];
        const extension = mimeType.split('/')[1];

        const fileName = `${userId}_${Date.now()}.${extension}`;
        const filePath = path.join('uploads/profilePics', fileName);

        fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

        const imgUrl = `/uploads/profilePics/${fileName}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {profilePic:imgUrl}, 
            {new:true}).
            select("-password");

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error in update profile controller: ", error);
        res.status(500).json({message: "Internal server error" });
    }
}