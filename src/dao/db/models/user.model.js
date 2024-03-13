import mongoose from "mongoose";

export const UserSchema =mongoose.model('usuarios' ,new mongoose.Schema({
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
    
}))



