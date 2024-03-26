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
    age: {
        type: Number,
        require: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    }
       

    
    
}))



