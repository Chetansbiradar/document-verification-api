const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register",async (req,res)=>{
    console.log(req.params);
    const newUser = new User({
        username:req.body.username,
        name:req.body.name,
        email:req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,process.env.CRYPTOJS_PASS_SEC
            ).toString()
        });
        try{
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }catch(err){
        console.log(err);
        res.status(500).json({YourError:err});
    }
});


//Login
router.post("/login",async(req,res)=>{
    try {
        const user = await User.findOne({username: req.body.username});
        
        if(!user){
            res.status(401).json("Invalid Credentials");
        }else{
            const hasedPassword = CryptoJS.AES.decrypt(user.password,process.env.CRYPTOJS_PASS_SEC);
            const password = hasedPassword.toString(CryptoJS.enc.Utf8);
            // console.log(password,user);
            // password!=req.body.password && res.status(401).json("Invalid Credentials!");
            if(password!==req.body.password){
                res.status(401).json("Invalid Credentials!");
            }else{
                const {password,...others} = user._doc;
                const accessToken = jwt.sign({
                    id:user._id,
                    accessLevel:user.accessLevel
                },
                process.env.JWT_SECRET,
                {expiresIn:"3d"});

                res.status(200).json({...others,accessToken});
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router