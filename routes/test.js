const router = require("express").Router();
const ReportCard = require("../models/ReportCard");
const { verifyTokenAndAdmin } = require("./verifyToken");

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});

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
    subjects: req.body.subjects,
    creditsDuringSem: req.body.creditsDuringSem,
    totalCredits: req.body.totalCredits,
    sgpa: req.body.sgpa,
    cgpa: req.body.cgpa,
  });
  try {
    const checkCardExists = await ReportCard.findOne({ srn: req.body.srn });

    //update if exists
    if (checkCardExists) {
      console.log("Card already exists");
      checkCardExists.updateOne({ srn: req.body.srn }, { $set: reoprtCard });
    }

    const report = await reoprtCard.save();
    if (!report)
      throw Error("Something went wrong while saving the Report Card");
    res.status(200).json(report);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const {
      srn,
      name,
      programOfStudy,
      semester,
      monthOfExam,
      yearOfExam,
      dateOfIssue,
      monthOfIssue,
      yearOfIssue,
      subjects,
      creditsDuringSem,
      totalCredits,
      sgpa,
      cgpa
    } = req.body;
    const file = req.file;
    res.status(200).json({ msg: "success" });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
