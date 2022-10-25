const express  = require('express');
const mongoose = require('mongoose');
const postRouter = require('./routes/posts')
const authRouter = require("./routes/auth")
const bodyParser = require('body-parser')
require('dotenv/config')

const app = express();

//MIDDLEWARE (eg: used to check if user is auth before going to that route)
app.use(bodyParser.json())
// app.use('/posts',postRouter)

//Routes
// app.get('/',(req,res)=>{
//     res.json({message:"Hello World"});
// });
app.use("/api/auth/",authRouter);

//connect to db
try {
    mongoose.connect(process.env.DATABASE_URL)
    const database = mongoose.connection
    database.on('error', (error) => {
        console.log(error)
    })
    
    database.once('connected', () => {
        console.log('Database Connected');
    })
} catch (error) {
    console.log("MongoDB Connect Error:",error);
}


//HOW TO START LISTIING TO THE SERVER
app.listen(5000);