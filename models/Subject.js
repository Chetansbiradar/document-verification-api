const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subName: {
    type: String,
    required: true,
  },
  subCode: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Subject", SubjectSchema);
