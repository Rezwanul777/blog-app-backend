const express=require('express');


const router=express.Router();


router.get('/',(req,res)=>{
    console.log('this is a GET request');
})



module.exports = router;