import User from "../models/User.js";

import bcrypt from "bcrypt";

import generateToken from "../lib/utils.js";

import "dotenv/config";

import {sendWelcomeEmail} from "../emails/emailHandler.js";

import {ENV} from '../lib/env.js';

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