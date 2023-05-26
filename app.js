
// core module

const path = require('path');
const{readdirSync} = require('fs');

// thirdparty modules

const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const morgan = require('morgan');
const router = require('./src/routes/authRouter');

require('dotenv').config();

//All Thir-pairty modules use middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(morgan('dev'));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//route limiter
const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000,
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

app.get('/test', (req, res) => {
    res.status(200).send({
        messsage:"api is running..."
    })
})

//rout middleware
readdirSync("./src/routes").map(r => app.use("/api/v1", require(`./src/routes/${r}`))) 

//app.use("/api/v1", router)
//undefine router
app.use('*',(req,res) => {
    res.status(404).send('This is undefined Router');
});


// server error handling-- all error handeling in server side

app.use((err,req,res,next)=>{
    return res.status(err.status||500).json({
        success:false,
        message:err.message
    })
})

module.exports=app

