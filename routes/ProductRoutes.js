const express = require('express');
const router = express.Router();
const formidable = require('express-formidable');
const {
    verifyUser,
    verifyAdmin
} = require('../utils/auth');
const {
    createProduct,
    DeleteUserProduct,
    findAllProducts,
    GetOneProduct,
    getPhoto,
    updateProduct,
    serchAllProducts,
    RelatedProducts,
    productCategory,
    braintreeToken,
    braintreePayment,
    GetAllOrders,
    AllOrders,
    ChangeStatus
}= require('../controller/UserProduct');

router.route('/create-product').post(verifyUser,verifyAdmin,formidable(),createProduct);
router.route('/update-product/:pid').put(verifyUser,verifyAdmin,formidable(),updateProduct);
router.route('/delete-product/:id').delete(verifyUser,verifyAdmin,DeleteUserProduct);
router.route('/getproduct').get( findAllProducts );
router.route('/getproduct/:slug').get(GetOneProduct);
router.route('/product-photo/:pid').get(getPhoto);
router.route('/product-search/:keyword').get(serchAllProducts);
router.route('/related/:pid/:cid').get(RelatedProducts);
router.route('/product-category/:slug').get(productCategory);
router.route('/braintree/token').get(braintreeToken);
router.route('/order').get(verifyUser,GetAllOrders);
router.route('/all-order').get(verifyUser,AllOrders);
router.route('/all-status/:orderId').put(verifyUser,verifyAdmin,ChangeStatus);
router.route('/payment').post(verifyUser,verifyAdmin,braintreePayment);

module.exports=router;