import mongoose from "mongoose";
const userCollection="user"
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true,
    },
    tel: {
        type: Number,
        require: true
    },
});

export const UserModel = mongoose.model(userCollection,UserSchema)

