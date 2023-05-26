const fs = require("fs");
const slugify = require("slugify");
const Blog = require("../models/blogModel");


// blog create controller

exports.create = async (req, res) => {
try {
   
    const { title, body } = req.fields;
    //photo file destructure
    const { photo } = req.files;
    //validation
    switch (true) {
      case !title.trim():
        return res.status(404).json({ error: "name is required!" });
      case !body.trim():
        return res.status(404).json({ error: "description is required!" });
      case photo && photo.size > 5e6: //5000000
        return res
          .status(404)
          .json({ error: "Image should be less than 5mb!" });
    }
    //new blog create
    const newBlog = new Blog({
      ...req.fields,
      author: req.user["name"],
      slug: slugify(title),
    });

    //photo create
    if (photo) {
      newBlog.photo.data = fs.readFileSync(photo.path);
      newBlog.photo.contentType = photo.type;
    }
    //data save
    await newBlog.save();
 
    res.status(201).json({ newBlog });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

//all blog controller

exports.allBlog = async (req, res) => {
    try {
      const allBlog = await Blog.find({})
        .select("-photo")
        .limit(12)
        .sort({ createdAt: -1 });
      //user response
      res.status(200).json(allBlog);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: error.message });
    }
  };

  // get single product

exports.getSingleBlog=async(req,res)=>{
    try {
       const product=await Blog.findOne({slug:req.params.slug}).select('-photo')
       res.status(200).send({
          success: true,
          message: "Single blog is found",
          product,
        });
    } catch (error) {
       console.log(error);
        res.status(500).send({
          message:"error in get single blog",
          error:error.message
          })
    }
 }
