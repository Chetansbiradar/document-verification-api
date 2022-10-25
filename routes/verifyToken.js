const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                res.status(403).json("Invalid token, wrong token or expired");
            }else{
                req.user = user;
                next();
            }
        })
    }else{
        return res.status(401).json("Your are not authenticated");
    }
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

module.exports = {verifyToken, verifyTokenAndAuthorization}