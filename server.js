

const app = require('./app.js');
const { serverPort } = require('./secret.js');
const connectDB = require('./src/config/db.js');


 // import from secret.js

app.listen(6000,async()=>{
    console.log(`server listening on ${serverPort}`); 
    await connectDB()
})
