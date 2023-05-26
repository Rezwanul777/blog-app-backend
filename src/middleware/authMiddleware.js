const jwt =require("jsonwebtoken");
const userModel = require("../models/userModel");

// protecting routes
exports.requireSignIn=async(req,res,next)=>{
   try {
      const decode=jwt.verify(
         req.headers.token,
         process.env.JWT_SECRET
         
      );
      req.user = decode;
      next()
   } catch (error) {
      console.log(error);
   }
}

// admin access
exports.isAdmin=async(req,res,next)=>{
  try {
   const user=await userModel.findById(req.user._id);
   if(user.role!==1){
      return res.status(401).send({
         success:false,
         message:"unAuthorizeD ACCESS"
      })
   }else{
      next()
   }
  } catch (error) {
   console.log(error);
   res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  } 
}