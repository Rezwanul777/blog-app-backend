const express = require('express');
const formidable =require("express-formidable");
//const BlogController = require('../controllers/blog');
const Controller=require('../controllers/blogController');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');
//const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// blog creation route
router.post('/blog-create',requireSignIn,isAdmin,formidable(),Controller.create);

// allblog router
router.get('/all-blog',Controller.allBlog)

// single blog router

router.get('/single-blog',Controller.getSingleBlog)

module.exports = router;