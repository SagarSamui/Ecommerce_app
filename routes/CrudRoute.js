const express = require('express');
const routes = express.Router();
const {
    verifyUser,
    verifyAdmin
} = require('../utils/auth');
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getOneCategory,
    getAllCategories
} = require('../controller/Crud');

routes.route('/create-getall').post(verifyUser,verifyAdmin,createCategory).get(getAllCategories);

routes.route('/update-delete/:id').put(verifyUser,verifyAdmin,updateCategory).delete(verifyUser,verifyAdmin,deleteCategory)

routes.route('/get/:slug').get(getOneCategory);

module.exports=routes;