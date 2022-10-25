const mongoose = require(mongoose)
const Schema = mongoose.Schema

const StudentSchema = mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    srn:{
        type:String,
        required: true
    }
})