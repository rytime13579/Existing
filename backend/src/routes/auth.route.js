import express from 'express';

import {signup, login, logout, updateProfile} from "../controllers/auth.controller.js";

import {protectRoute} from "../middleware/auth.middleware.js";

import { arcjetProtection } from '../middleware/arcjet.middleware.js';

import { ENV } from "../lib/env.js";

const router = express.Router();

if (ENV.NODE_ENV !== "development") {
    router.use(arcjetProtection);
}

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

//protectRoute ensures the user is logged in correctly before updating profile
router.put("/update-profile", protectRoute, updateProfile);

// check if user is logged in 
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router;