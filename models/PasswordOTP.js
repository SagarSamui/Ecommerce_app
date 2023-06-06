const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({

    email:{
        type:String,
    },
    code:{
        type:String,
    },
    expireIn:{
        type:String,
    }
},{
    timestamps:true
});

const productData = mongoose.model('otp',otpSchema,'otp');
module.exports= productData;