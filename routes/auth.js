const router = require("express").Router();
const User = require("../models/User");
// const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const joiSchema = require("./validation");
const RegisterValidator = require("./validation");


//Register
router.post("/register",async (req,res)=>{
    
    //Validate
    const {error} = RegisterValidator(req.body)
    if(error){
        return res.status(200).json({"error":{message:error.details[0].message}})
    }

    //check if email exits
    const emailExits = await User.findOne({email:req.body.email});
    if(emailExits){
        return res.status(400).json({"error":{message:"email already exists"}})
    }

    //register user if all good
    const salt = await bcrypt.genSalt(10); //salting
    const hasedPassword = await bcrypt.hash(req.body.password,salt) //hashing
    console.log(req.params);
    const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        password: hasedPassword
        });
        try{
            const savedUser = await newUser.save();
            const {accessLevel,password,...savedUserResponse} = savedUser._doc;
            res.status(201).json(savedUserResponse);
        }catch(err){
            res.status(500).json({error:"Something went wrong!"});
            console.log(err);
    }
});


//Login
router.post("/login",async(req,res)=>{
    try {
        const user = await User.findOne({email: req.body.email});
        console.log(user)
        
        if(!user) return res.status(401).json("Invalid Credentialse e");
        const password = await bcrypt.compare(req.body.password,user.password);

        console.log(password)
        if(!password) return res.status(401).json("Invalid Credentials! p");

        const accessToken = jwt.sign(
            {
                id:user._id,
                email:user.email,
                name:user.name,
                accessLevel:user.accessLevel
            },
            process.env.JWT_SECRET,
            {   expiresIn:"3d" 
            }
        );
        res.cookie("auth_token",accessToken,{ expires: new Date(Date.now() + 3*24*60*60*1000), httpOnly: true })
        .status(200)
        .send({"message":"Logged in successfully"}); //15 days

    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router