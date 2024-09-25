const jwt = require("jsonwebtoken")

const auth = (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1]
    // console.log(token);
    if(!token){
        return res.status(401).json({msg:"Access denied. No token provided."})
    }

    let decode = jwt.verify(token,process.env.JWT_SECRET)
    
    req.user = decode

    next()
    
}

module.exports = auth