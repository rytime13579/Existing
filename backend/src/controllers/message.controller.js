import Message from"../models/Message.js";
import User from "../models/User.js";

// get all contacts in the database except the users profile

export const getAllContacts = async (req, res) => {
    try {
        // get current user id
        // in order to get _id from user we must use the protectedroute middleware function
        //              which checks if the user is logged in and if so returns user
        const loggedInUserId = req.user._id;
        // find every single user and then extract the one we we want (user id)
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        

        res.status(200).json(filteredUsers);



    }catch (error) {
        console.log("Error at get all contacts", error);
        res.status(500).json({message: "Server error"});
    } 
}

// get messages by user id
// get all messages between current user and another user
export const getMessagesByUserId = async (req, res) => {
    try {
        // get the id of the logged in user
        const myId = req.user._id;

        // get id of the selected user that we are trying to get chat history of
        const {id:userToChatId} = req.params;
        
        // find messages in database by user
        const messages = await Message.find({
            // or clause to choose between.....
            $or: [
                {senderId:myId, receiverId: userToChatId}, // i send you the message
                {receiverId: userToChatId, senderId:myId}, // you send me the message
            ]
        });

        res.status(200).json(messages);


    }catch (error) {
        console.log("Error in getMessages controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async(req, res) => {
    try {
        const {text, image} = req.body; // get text and/or image from body
        const {id: receiverId} = req.params; // get receiverId from params (who we are sending to)
        const senderId = req.user._id; // get senderId from user._id (or from the protectroute middleware) 
        
        // edge case handling
        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
            const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
                return res.status(404).json({ message: "Receiver not found." });
        }


        let imageUrl;
        // get image from body and parse url from cloudinary
        if(image) {

            // upload it to cloudinary
            // TODO: release yourself from this dog shit api
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        // create new Message object from the information we have spliced
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        // save message to databse
        await newMessage.save();

        // todo: send message in real-time if user is online - socket.io

        // respond with sent messagegetChatPartners
        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
    }
}
// find all messages where we are either the sender or reciever
// then extract the users from there
export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or :[{senderId: loggedInUserId}, {receiverId: loggedInUserId}],
        });

        // get messages where sender id is the same as the logged in user
        // or get messages where msg.sender id is the same as the target senderId

        const chatPartnerIds = [ // map messages to a set, then spread to an array
            ...new Set(messages.map(msg => 
                msg.senderId.toString() === loggedInUserId.toString() 
                ? msg.receiverId.toString() 
                : msg.senderId.toString()
                )
            )
        ];
        
        const chatPartners = await User.find({_id: {$in:chatPartnerIds}}).select("-password");

        res.status(200).json(chatPartners);

        // find all messages where the logged-in user is either sender or reciever
    } catch (error) {
        console.error("Error in getChatPartners", error.message);
        res.status(500).json({ error : "Internal server error"});
    }
}