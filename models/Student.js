const mongoose = require("mongoose")


const StudentSchema = new mongoose.Schema({
    srn: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    departmentCode: {
        type: String,
        required: true,
    },
    reportCards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ReportCard",
        },
    ],
})

module.exports = mongoose.model("Student", StudentSchema)
