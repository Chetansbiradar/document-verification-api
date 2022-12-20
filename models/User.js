const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 3,
        max:50
    },
    email:{
        type: String,
        required: true,
        unique:true,
        max:1500
    },
    accessLevel:{
        type:Number,
        default: 0
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:1024
    }

},{timestamps:true});

module.exports = mongoose.model('User',UserSchema);