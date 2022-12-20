const router = require("express").Router();
const User = require("../models/User");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require("../utils/verifyToken")

//get user details
router.post("/user",verifyToken,async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("name email accessLevel -_id");
        if(!user) throw Error("User does not exist");
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router