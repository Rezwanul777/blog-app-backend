const mongoose=require("mongoose");
const { mongoUrl } = require("../../secret");


const connectDB=async(options={})=>{
    try {
        await mongoose.connect(mongoUrl,options)
        console.log("database connected is success");
        mongoose.connection.on("error", (err) =>{
            console.error("database connection error", err)
        })
       
    } catch (error) {
        console.log("database connection failed", error.toString());
    }
}

module.exports = connectDB