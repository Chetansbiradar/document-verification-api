const Subject = require("./Subject")
const mongoose = require("mongoose")

const ReportCardSchema = new mongoose.Schema({
  srn: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  programOfStudy: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  monthOfExam: {
    type: String,
    required: true,
  },
  yearOfExam: {
    type: String,
    required: true,
  },
  dateOfIssue: {
    type: String,
    required: true,
  },
  monthOfIssue: {
    type: String,
    required: true,
  },
  yearOfIssue: {
    type: String,
    required: true,
  },
  subjects: [Subject.schema],
  creditsDuringSem: {
    type: Number,
    required: true,
  },
  totalCredits: {
    type: Number,
    required: true,
  },
  sgpa: {
    type: Number,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
  },
  imageName:{
    type:String
  },
  imageUrl:{
    type: String
  }
});

module.exports = mongoose.model(
  'ReportCard',
  ReportCardSchema
);