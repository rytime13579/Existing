import mongoose from "mongoose";

// define how a user will be stored in our database
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true,
    },
    fullName:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required:true,
        minLength:6
    },
    profilePic:{
        type: String,
        default: ""
    },
}, {timestamps: true}) //createdAt & updatedAt
// "User here defines the json file in which the above will be stored in the database"
const User = mongoose.model("User", userSchema);

export default User;