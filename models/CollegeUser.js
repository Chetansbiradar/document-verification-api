const mongoose = require(mongoose)
const Schema = mongoose.Schema

const CollegeUserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },

});

module.exports = mongoose.model('CollegeUser',CollegeUserSchema);