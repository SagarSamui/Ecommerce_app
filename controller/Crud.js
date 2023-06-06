const crudData = require('../models/Crud');
const slugify = require('slugify');

exports.createCategory=async(req,res,next)=>{
    
    try {
        const { name } = req.body;
        const cehckCategory = await crudData.findOne({name});

        if(cehckCategory){
            return res.status(400).json({
                success:false,
                message:'This category alredy exist'
            })
        }

        const category = new crudData({name, slug:slugify(name)});
        const createdData = await category.save();
        res.status(200).json({
            success:true,
            createdData,
            message:'Category Successfully created'
        })
    } catch (err) {
        next(err)
    }
}

// exports.createProduct='/api/create',async(req,res,next)=>{
//     const create = new crudData(req.body);

//     try {
//         const createdData = await create.save();
//         res.status(200).json({
//             success:true,
//             createdData,
//             message:'Product Successfully created'
//         })
        
//     } catch (err) {
//         next(err)
//     }
// }


exports.updateCategory= async(req,res,next)=>{
    try {
        const {name} = req.body;
        const update = await crudData.findByIdAndUpdate(req.params.id,{name,slug:slugify(name)},{new:true});
        res.status(200).json({
            success:true,
            update,
            message:"Category updated successfully"
        })

    } catch (err) {
        next(err)
    }
}


exports.deleteCategory= async(req,res,next)=>{
    try {
        const deleteProduct = await crudData.findByIdAndDelete(req.params.id);

        if (!deleteProduct) {
            return res.status(402).json({
                success:false,
                message:'Category does not exist anymore'
            })
        }

        res.status(200).json({
            success:true,
            message:"You have Successfull deleted the Category"
        });

    } catch (err) {
        next(err);
    }

}


exports.getOneCategory = async(req,res,next)=>{
    try {
        const getData= await crudData.findOne({slug:req.params.slug});
        res.status(200).json({
            success:true,
            getData,
            message:"Found the Category"
        });
    } catch (err) {
        next(err)               
    }
}


exports.getAllCategories = async(req,res,next)=>{
    try {
        const getAllData = await crudData.find();
        res.status(200).json({
         success:true,
         getAllData,
         message:"All Categories Found"   
        })
    } catch (err) {
        next(err)       
    }
}