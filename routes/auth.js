const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
        if(!user) return res.status(401).json("Invalid Credentialse e");
        const password = await bcrypt.compare(req.body.password,user.password);
        if(!password) return res.status(401).json("Invalid Credentials! p");

        const accessToken = jwt.sign(
            {
                id:user._id,
                name:user.name,
                email:user.email,
                accessLevel:user.accessLevel
            },
            process.env.JWT_SECRET,
            {   expiresIn:"3d" 
            }
        );
        res.status(200).json({accessToken:accessToken,"message":"Login Successful"});

    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router