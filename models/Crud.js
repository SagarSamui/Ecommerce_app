const mongoose= require('mongoose');

const crudSchema= new mongoose.Schema({
    name:{
        type:String
    },
    slug:{
        type:String,
        lowercase:true,
    }
})

const crudData= mongoose.model('category',crudSchema);
module.exports=crudData;