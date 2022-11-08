const router = require("express").Router();
const Document = require("../models/ReportCard");
const {verifyTokenAndAdmin,verifyTokenAndAuthorization} = require("./verifyToken");
// const joiSchema = require("./validation");
// const RegisterValidator = require("./validation");

// @route   GET api/docs
// @desc    Get all docs
// @access  Public
router.get("/",verifyTokenAndAdmin,async (req, res) => {
    try {
        const docs = await Document.find();
        if (!docs) throw Error("No docs");
        res.status(200).json(docs);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
})

// @route   POST api/docs
// @desc    Create a doc
// @access  verifyTokenAndAdmin
router.post("/",verifyTokenAndAdmin,async (req, res) => {
    const newDoc = new Document(req.body);
    try {
        const doc = await newDoc.save();
        if (!doc) throw Error("Something went wrong while saving the doc");
        res.status(200).json(doc);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
})



module.exports = router