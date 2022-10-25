const mongoose = require(mongoose)
const Schema = mongoose.Schema

const TenthSchema = new Schema({
    registerNumber:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    fatherName:{
        type: String,
        required: true 
    },
    motherName:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: String,
        required: true
    },
    board:{
        type: String,
        required: true
    },
    marksAndSubjects:[{subject:{type:Number, required:true}}],
    percentage:{
        type: Number,
        required: true
    }
});

const TwelfthSchema = new Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    registerNumber:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    fatherName:{
        type: String,
        required: true 
    },
    motherName:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: String,
        required: true
    },
    board:{
        type: String,
        required: true
    },
    marksAndSubjects:[{subject:{type:Number, required:true}}],
    percentage:{
        type: Number,
        required: true
    }
});

exports.module.TenthSchema = mongoose.model('Tenth',TenthSchema)
exports.module.TwelthSchema = mongoose.model('Twelth',TwelthSchema)