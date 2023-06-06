const mongoose= require('mongoose');
const validator= require('validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Details = new mongoose.Schema({
    name:{
        type:String,
    },
    age:{
        type:String,
    },
    phone:{
        type:String,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        trim:true,
    },
    answer:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Number,
        default:0
    },
    tokens:{
        type:String,
    },    
    // resetLink:{
    //     data:String,
    //     default:""
    // }, 
},
{
    timestamps:true

});


const userData= mongoose.model('User',Details);
module.exports=userData;