const router = require("express").Router();
const User = require("../models/User");
// const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//
router.post("/register",async (req,res)=>{
    const salt = await bcrypt.genSalt(10);
    console.log(req.params);
    const newUser = new User({
        username:req.body.username,
        name:req.body.name,
        email:req.body.email,
        password: await bcrypt.hash(req.body.password,salt)
        // password: CryptoJS.AES.encrypt(
        //     req.body.password,process.env.CRYPTOJS_PASS_SEC
        //     ).toString()
        });
        try{
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }catch(err){
            if(err.keyValue.username){
                res.status(500).json({err:"User Already Exist"})
            }
            else if(err.keyValue.email){
                res.status(500).json({err:"Email Already Exist"})
            }else{
                res.status(500).json({err:"Something went wrong!"});
            }
        // console.log(err);
    }
});


//Login
router.post("/login",async(req,res)=>{
    try {
        const user = await User.findOne({username: req.body.username});
        
        if(!user){
            res.status(401).json("Invalid Credentials");
        }else{
            // const hasedPassword = CryptoJS.AES.decrypt(user.password,process.env.CRYPTOJS_PASS_SEC);
            const password = await bcrypt.compare(req.body.password,user.password);
            // const password = hasedPassword.toString(CryptoJS.enc.Utf8);
            // console.log(password,user);
            // password!=req.body.password && res.status(401).json("Invalid Credentials!");
            if(!password){
                res.status(401).json("Invalid Credentials!");
            }else{
                // const {password,...others} = user._doc;
                const accessToken = jwt.sign({
                    id:user._id,
                    accessLevel:user.accessLevel,
                    isApproved:user.isApproved
                },
                process.env.JWT_SECRET,
                {expiresIn:"3d"});

                res.status(200).json(accessToken);
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router