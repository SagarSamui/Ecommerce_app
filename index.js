const express = require('express');
const app= express();
const dotenv= require('dotenv');
dotenv.config();
const cors = require('cors');
const morgan = require('morgan');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const cookieParser= require('cookie-parser');
const path = require('path');


const userRouter= require('./routes/UserRoute');
const crudRouter= require('./routes/CrudRoute');
const productRouter= require('./routes/ProductRoutes');
const router = require('./routes/ProductRoutes');

const mongoConnect= async()=>{
    try {

         mongoose.connect(process.env.MONGO)
        console.log('Successfully Connected to the Mongodb');

    } catch (error) {

        console.log('Sorry Something Went Wrong Cant Connect to Mongodb',error);

    }
}


// use files

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(bodyParser.json());

app.use('/api/auth/v1',userRouter);
app.use('/api/auth/v1/category',crudRouter);
app.use('/api/auth/v1/product',productRouter);

app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Something Went Wrong (From index)"
    return res.status(500).json({
        success:false,
        status:status,
        message:message,
        stack:err.stack
    });
});

app.use(express.static(path.join(__dirname, './frontend/build')));

app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'))
}); 

app.listen(process.env.PORT,()=>{
    try {
        
        mongoConnect();
        console.log(`Port is running on ${process.env.PORT} ${process.env.CLIENT_URL}`);

    } catch (error) {
        console.log(`Sry Cant Connect to ${process.env.PORT} Port`);      
    }
})

