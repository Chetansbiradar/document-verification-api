const router = require("express").Router();
const Document = require("../models/ReportCard");
const {verifyTokenAndAdmin,verifyTokenAndAuthorization} = require("../utils/verifyToken");

//docs admin routes

//upload Student Report Card
router.post("/upload",verifyTokenAndAdmin,async (req, res) => {
    const newDoc = new Document(req.body);
    console.log(newDoc);
    try {
        // const doc = await newDoc.save();
        // if (!doc) throw Error("Something went wrong while saving the doc");
        res.status(200).json({"hello":"world"});
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


router.get("/",verifyTokenAndAdmin,async (req, res) => {
    try {
        const docs = await Document.find();
        if (!docs) throw Error("No docs");
        res.status(200).json(docs);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

router.post("/",verifyTokenAndAdmin,async (req, res) => {
    const newDoc = new Document(req.body);
    try {
        const doc = await newDoc.save();
        if (!doc) throw Error("Something went wrong while saving the doc");
        res.status(200).json(doc);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

module.exports = router