const mongoose= require('mongoose');

const orderSchema= new mongoose.Schema({
    products:[{
        type:mongoose.ObjectId,
        ref:'products'
    },],
    payment:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
        enum: ['Not process', 'Processing', 'Shipped', 'Cancle'],
        default: 'Not process',
    }
},{
    timestamps:true,
})

const orderData= mongoose.model('order',orderSchema);
module.exports=orderData;