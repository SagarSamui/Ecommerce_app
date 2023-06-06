const {Register,Login,RouteProtection,ForgetPassword,RouteAdmin,UpdateUser}=require('../controller/UserControll');
const express = require ('express');
const {verifyUser,verifyAdmin} = require ('../utils/auth');
const route = express.Router();
const {signup} = require('../middleware/validation/validation');


route.post('/register',signup,Register);

route.route('/login').post(Login);

route.route('/forgetpassword').post(ForgetPassword);

route.route('/user-auth').get(verifyUser,RouteProtection);

route.route('/admin-auth').get(verifyUser,verifyAdmin,RouteAdmin);

route.route('/profile').put(verifyUser,UpdateUser);




module.exports=route