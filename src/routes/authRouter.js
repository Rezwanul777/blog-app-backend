const express=require('express')
const Controller=require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');


// middleware import


//router object

const router=express.Router();

//routing
// register router
router.post('/register',Controller.registerController);
router.post('/login',Controller.loginController);

// test router
router.get('/test',requireSignIn,isAdmin,Controller.testController)

router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
 })
 
 // protected admin route
 
 router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
 })


module.exports = router;