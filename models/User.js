const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    accessLevel:{
        type:Number,
        default: 0
    },
    password:{
        type:String,
        required:true
    }

},{timestamps:true});

module.exports = mongoose.model('User',UserSchema);