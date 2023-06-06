const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        lowercase:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'category',
        required:true
    },
    quentity:{
        type:Number,
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        type:Boolean,
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    }
},
{
    timeStamps:true
});

const productData = mongoose.model('products',productSchema);
module.exports= productData;