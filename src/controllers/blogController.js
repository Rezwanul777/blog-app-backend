const fs = require("fs");
const slugify = require("slugify");
const Blog = require("../models/blogModel");


// blog create controller

exports.create = async (req, res) => {
try {
   // destructure title, body, author
    const { title, body,author } = req.fields;
    //photo file destructure
    const { photo } = req.files;
    //validation
    switch (true) {
      case !title.trim():
        return res.status(404).json({ error: "name is required!" });
      case !body.trim():
        return res.status(404).json({ error: "description is required!" });
      case !author.trim():
        return res.status(404).json({ error: "author name is required!" });

      case photo && photo.size > 5e6: //5000000
        return res
          .status(404)
          .json({ error: "Image should be less than 5mb!" });
    }
    //new blog create
    const newBlog = new Blog({
      ...req.fields,
      //author: req.user["name"],
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
        .limit(10)
        .sort({ createdAt: -1 });
      //user response
      res.status(200).send({
        success:true,
        total:allBlog.length,
        message:"all Blogs in list",
        allBlog
      })
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: error.message });
    }
  };

  // get single product

exports.getSingleBlog=async(req,res)=>{
    try {
       const singleBlog=await Blog.findOne({slug:req.params.slug}).select('-photo')
       res.status(200).send({
          success: true,
          message: "Single blog is found",
          singleBlog,
        });
    } catch (error) {
       console.log(error);
        res.status(500).send({
          message:"error in get single blog",
          error:error.message
          })
    }
 }

 // photo read

 exports.getPhoto=async(req,res)=>{
  try {
     const photoBlog=await Blog.findById(req.params.blogId).select("photo")
    if(photoBlog.photo.data){
     
     res.set('Content-type',photoBlog.photo.contentType)
     //res.set("Cross-Origin-Resource-Policy", "cross-origin");
     return res.status(200).send(photoBlog.photo.data);

    }
  } catch (error) {
     console.log(error);
     res.status(500).send({
        message:"error in get photo blog",
        error:error.message
        })
  }
}

// delete blog

exports.deleteBlog=async(req,res)=>{
  try {
    const blog=await Blog.findByIdAndDelete(req.params.blogId).select("-photo")
    res.status(200).send({
     success: true,
     message: "blog Deleted successfully",
    blog
   }); 
  } catch (error) {
     console.log(error);
      res.status(500).send({
        message:"error in delete blog",
        error:error.message
        })
  }

}

  // update single blog

  exports.blogUpdate=async(req,res)=>{

    try {
       // destructure title, body, author
    const { title, body,author } = req.fields;
    //photo file destructure
    const { photo } = req.files;
    //validation
    switch (true) {
      case !title.trim():
        return res.status(404).json({ error: "name is required!" });
      case !body.trim():
        return res.status(404).json({ error: "description is required!" });
      case !author.trim():
        return res.status(404).json({ error: "author name is required!" });

      case photo && photo.size > 5e6: //5000000
        return res
          .status(404)
          .json({ error: "Image should be less than 5mb!" });
    }
       const blogs=await Blog.findByIdAndUpdate(req.params.blogId,{...req.fields,slug:slugify(title)},{new:true})
       if(photo){
       blogs.photo.data = fs.readFileSync(photo.path);
       blogs.photo.contentType = photo.type;
       }
       await blogs.save()
       res.status(201).send({
          success: true,
          message: "Blog updated Successfully",
         blogs,
        });
    } catch (error) {
       console.log(error);
       res.status(500).send({
          success:false,
          error,
          message:"Error in update blog"
       })
    }
 }

