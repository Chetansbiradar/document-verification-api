const router = require("express").Router();
const User = require("../models/User");
const {verifyTokenAndAdmin} = require("./verifyToken")

// getRegisteredUsers
router.get("/registeredusers",verifyTokenAndAdmin,async (req,res,next)=>{
    const users = await User.find({"accessLevel":0})
    res.status(200).json(users);
})

// giveAccessToUser
router.get("/upgradeuser/:id/:accessLevel",verifyTokenAndAdmin, async (req,res,next)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user) return res.status(400).json({"error":{"message":"Invalid User ID"}})
        if(req.params.accessLevel>2 || req.params.accessLevel<0) return res.status(400).json({"error":{"message":"Invalid Access Level"}})
        const updated = await user.updateOne({"_id":req.params.id},{accessLevel:req.params.accessLevel})
        if(updated.modifiedCount ===1) return res.status(202).json({"message":"User Updated Successfully"})
    } catch (error) {
        return res.status(400).json({"error":{"message":"No User found by that ID or Coudn't update the user"}})        
    }
})

module.exports = router;