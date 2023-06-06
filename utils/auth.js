const jwt = require('jsonwebtoken');
const { createError } = require('./errorController');
const dotenv = require('dotenv');
const userData = require('../models/User');
dotenv.config();



// verifying user token

exports.verifyUser = async (req, res, next) => {

    try {
        const token = await jwt.verify(req.headers.authorization, process.env.SECURITY);

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Login to Access this page..."
            })
        }

        req.user=token;

        next()

    } catch (error) {
        next(createError(403, "You are not authorized to access this page"))
    }

}

// verifying admin

exports.verifyAdmin = async(req, res, next) => {
    try {

        const admin = await userData.findById(req.user._id);

        if(admin.isAdmin !== 1){
            return res.status(404).json({
                success:false,
                message:"Cant find Admin"
            })
        }else{
        next()
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message:'Only admin can access this page'
        });
    }
}


