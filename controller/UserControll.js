var bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const userData = require('../models/User');



exports.Register = async(req, res, next) => {

    const { name, email, password, phone, age, address, answer } = req.body;

    try {

        if (!name || !email || !password || !phone || !address || !age || !answer) {
    
            return res.status(400).send("Plz fill all the details").json({
                success: false,
                message: "Plz fill all the details"
            });
    
        }

        const userExist = await userData.findOne({ email: email });

        if (userExist) {
            return res.status(404).json({
                success: false,
                message: "This email already exist"
            });
        }

            const salt = await bcrypt.genSaltSync(10);
            const hash = await bcrypt.hashSync(password, salt);

        const newUser = new userData({
            name: name,
            password: hash,
            email: email,
            age: age,
            phone:phone,
            address: address,
            answer: answer,
        });

        await newUser.save();
        
        res.status(200).json({
            success: true,
            message: "Registration is successfull"
        });

    } catch (error) {
        next(error);
        res.status(400).json({
            success: false,
            message: "Registration is not possible"
        });
    }
}


exports.Login = async (req, res, next) => {
    try {
     
        const { email, password} = req.body;
     

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Plz fill all the details"
            });
        }

        const getEmail = await userData.findOne({ email: email });

        // let token;
  
        if (getEmail) {
            const isMatch = await bcrypt.compare(password, getEmail.password);

            const token = jwt.sign({_id:getEmail._id,isAdmin:getEmail.isAdmin},process.env.SECURITY,{
                expiresIn:'7d',

            });

            if (isMatch) {
                res.status(200).json({
                    success: true,
                    user: {
                        name:getEmail.name,
                        email:getEmail.email,
                        age:getEmail.age,
                        phone:getEmail.phone,
                        address:getEmail.address,
                        answer:getEmail.answer,
                        isAdmin:getEmail.isAdmin
                    },
                    token:token,
                    message: "Login Successfully..."
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Invalid credential pass..."
                })
            }
           
            await userData.findOneAndUpdate(getEmail._id,{tokens:token})
           

        }else{
            return res.status(500).json({
                success: false,
                message: "Plz enter Registered email and password..."
            });
        }


    } catch (error) {
        next(error);
        res.status(400).json({
            success: false,
            message: "Plz enter the Valid User and Password"
        });
    }
}

exports.RouteProtection = async(req,res) => {
    res.status(200).send({ok:true});
}

exports.RouteAdmin = async(req,res) => {
    res.status(200).send({ok:true});
}

exports.ForgetPassword = async (req,res,next)=>{

    const {email, answer, newPassword} = req.body;

    try{
        if(!email || !answer || !newPassword){
            res.status(404).send({message:"Please enter all the required details"})
        }

        const user = await userData.findOne({email:email,answer:answer})

        if(!user){
            res.status(404).json({
                success:false,
                message:"Wrong Email or Answer"
            })
        }

        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(newPassword, salt);

        await userData.findOneAndUpdate(user._id,{password:hash});

        res.status(200).json({
            success:true,
            message:"Password Successfully Reset"
        })

    }catch(error){
        res.status(404).json({
            success:false,
            message:"Cannot Reset Password"
        })
    }
}

exports.UpdateUser = async (req,res,next) => {
    try {

        const {name, email,password,age,address,phone} = req.body;

        const user = await userData.findById(req.user._id);

        if (password && password.length < 8) {
            return res.status(400).json({
                success:false,
                message:"Password is required"
            });
        }

        const salt = await bcrypt.genSaltSync(10);
        const hash = password ? await bcrypt.hashSync(password, salt) : undefined;

        const update = await userData.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            email: email,
            password:hash,
            age: age || user.age,
            address: address || user.address,
            phone: phone || user.phone
        },{new:true})

        if(!update){
            res.status(404).json({
                success:false,
                message:"Error in user update"
            })
        }

        res.status(200).json({
            success:true,
            update,
            message:"Update Successfully"
        })

    } catch (error) {
        next(error)
        res.status(404).json({
            success:false,
            message:"Cannot update user"
        })
    }
}

