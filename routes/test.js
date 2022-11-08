const router = require("express").Router();
const ReportCard = require("../models/ReportCard");
const { verifyTokenAndAdmin } = require("./verifyToken");

// @route   POST api/universities
// @desc    Create a university
// @access  verifyTokenAndAdmin
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const reoprtCard = new ReportCard({
    srn: req.body.srn,
    name: req.body.name,
    programOfStudy: req.body.programOfStudy,
    semester: req.body.semester,
    monthOfExam: req.body.monthOfExam,
    yearOfExam: req.body.yearOfExam,
    dateOfIssue: req.body.dateOfIssue,
    monthOfIssue: req.body.monthOfIssue,
    yearOfIssue: req.body.yearOfIssue,
    subjects:[],
    creditsDuringSem: req.body.creditsDuringSem,
    totalCredits: req.body.totalCredits,
    sgpa: req.body.sgpa,
    cgpa: req.body.cgpa,
  });
  req.body.subjects.forEach((subject) => {
    reoprtCard.subjects.push({
      subName: subject.subName,
      subCode: subject.subCode,
      credits: subject.credits,
      grade: subject.grade,
    });
  })
  try {
    const checkCardExists = await ReportCard.findOne({srn: req.body.srn});
    if(checkCardExists) {
        const upadteCard = await checkCardExists.updateOne({$set: reoprtCard});
    }
    const report = await reoprtCard.save();
    if (!report)
      throw Error("Something went wrong while saving the Report Card");
    res.status(200).json(report);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
