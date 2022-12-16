const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    const token  = req.headers.authorization
    if(!token) return res.status(403).json({"error":{"message":"Token Missing, did you get one?"}})

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            res.status(403).json("Invalid token or expired");
        }else{
            req.user = user;
            next();
        }
    })
};

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.accessLevel=== 1 ){
            next();
        }else{
            res.status(403).json("Your are not allowed to do this");
        }
    })
};

const verifyTokenAndAdmin = (req,res,next)=>{
    console.log(req);
    verifyToken(req,res,()=>{
        console.log(req.user)
        if(req.user.accessLevel === 2){
            const d = new Date();
            console.log("🔋Admin route accessed on: ",d," 🕵️")
            next();
        }else{
            res.status(403).json({"error":{"message":"Your are not allowed to do this, probably you shouldn't be on this route"}});
        }
    })
};

module.exports = {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin}