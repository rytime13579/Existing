import express from "express";
import { ENV } from "../lib/env.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

import {getAllContacts, getMessagesByUserId, sendMessage, getChatPartners} from "../controllers/message.controller.js";

const router = express.Router();

// these middlewares excute in order
// first the function will get rate limited, then unauthorized users will be blocked

if (ENV.NODE_ENV !== "development") {
    router.use(arcjetProtection);
}
router.use(protectRoute);

// always static before dynamic
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
// always static before dynamic
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage );

export default router;