const { hashPassword,comparePassword } = require('../helper/auth');
const userModel=require('../models/userModel')
const jwt =require("jsonwebtoken");
require("dotenv").config();

// register
exports.registerController=async(req,res)=>{
   try {
      // 1. destructure name, email, password from req.body
      const{name,email,password}=req.body;
      // 2. all fields require validation
      if(!name.trim()){
         return res.send({message:"name is required"})
      }
      if(!email){
         return res.send({message:"email is required"})
      }
      if(!password){
         return res.send({message:"password is required"})
      }
    
    
      // check user
      const existingUser=await userModel.findOne({email})
      // check existing user
      if(existingUser){
         return res.status(200).send({
            success:false,
            message:"Already exists please login",

         })
      }
      // hashed password
      const hashedPassword=await hashPassword(password)
      // save
      const user=await new userModel({
         name,email,password:hashedPassword
      }).save();
      res.status(201).send({
         success:true,
         message:"register complete",
         user
      })
   } catch (error) {
      console.log(error);
      res.status(500).send({
         success:false,
         message:"Error in registration",
         error
      })
   }
}



// login controller
exports.loginController = async(req,res)=>{
    try {
       const {email,password} =req.body;
       // validation
       if(!email || !password){
         return res.status(404).send({
             success:false,
             message:"invalid email or password",
             
          })   
 
       }
       // check user
       const user=await userModel.findOne({email})
       if(!user){
          return res.status(404).send({
             success:false,
             message:"invalid email"
          })
       }
       const match= await comparePassword(password,user.password)
       if(!match){
         return res.status(200).send({
             success:false,
             message:"invalid email or password"
          })
       }
          // token
          const token =  jwt.sign({_id:user._id},process.env.JWT_SECRET,{
             expiresIn:"7d"
          })
          // send response
          res.status(200).send({
             success:true,
             message:"login successful",
             user:{
                name:user.name,
                email:user.email,
                
                role:user.role
             },
             token
            
          })
       
    } catch (error) {
       console.log(error);
       res.status(500).send({
          success:false,
          message:"Error in login",
          error
       })
    } 
 }

 exports.testController = (req, res) => {
    try {
      res.send("Protected Routes");
    } catch (error) {
      console.log(error);
     // res.send({ error });
    }
  };