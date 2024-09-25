const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignup = async(req,res)=>{
    let {name,email,password} = req.body
    let user = await userModel.findOne({email})
    if(user){
        return res.status(400).json({error:"User Already Exist!"})
    }
    let hashedPassword = await bcrypt.hash(password,10)

    let newUser = new userModel({
        name,
        email,
        password:hashedPassword
    })

    await newUser.save()
    res.status(201).json({message:"User Registered Successfully"})
}

const userLogin = async(req,res)=>{
    let {email, password}=req.body
    let user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({error:"Register First"})
    }

    let isPasswordValid = await bcrypt.compare(password,user.password)
    // console.log(password);
    // console.log(isPasswordValid);

    // console.log(Boolean(password));
    
    if(Boolean(password) != isPasswordValid){
        return res.status(400).json({error:"Password Incorrect"})
    }

    let token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:"1hr"})
    res.status(201).json({message:"User Logged in Successfully",token})
}

module.exports = {userSignup,userLogin}