const productData = require('../models/Product');
const crudData = require('../models/Crud');
const orderData = require('../models/OrderProduct');
const braintree = require('braintree');
const fs = require('fs');
const slugify = require('slugify');
const dotenv = require('dotenv');
dotenv.config();

//Payment gateway

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Create User Data

exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, title, quentity, category } = req.fields;
        const { photo } = req.files;

        if (!name || !description || !title || !price || !quentity || !category) {
            return res.status(400).json({
                success: false,
                message: "Please insert all the details"
            });
        }

        if (photo && photo.size > 1000000) {
            return res.status(400).json({
                success: false,
                message: "Photo is required less then 1mb"
            });
        }

        const product = new productData({ ...req.fields, slug: slugify(name) });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        const savedProduct = await product.save();

        res.status(200).json({
            success: true,
            savedProduct,
            message: "Product have been saved successfully..."
        });

    } catch (err) {

        next(err);

    }
}

// Delete User product id

exports.DeleteUserProduct = async (req, res, next) => {
    try {

        const deleteProduct = await productData.findByIdAndDelete(req.params.id);

        if (!deleteProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product Does not Exist'
            })
        }

        res.status(200).json({
            success: true,
            message: "Product has been succesfull removed"
        });

    } catch (err) {
        next(err);
    }
}

// Get All User Product 

exports.findAllProducts = async (req, res, next) => {
    try {

        const product = await productData.find().populate('category').select("-photo").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            totalProduct: product.length,
            product,
            message: "All products"
        });

    } catch (err) {
        next(err);
    }
}

// Get One Product

exports.GetOneProduct = async (req, res, next) => {
    try {

        const oneProduct = await productData.findOne({ slug: req.params.slug }).populate('category').select("-photo")

        if (!oneProduct) {
            return res.status(400).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            Product: oneProduct,
            message: 'Successfully Got the single product'
        })

    } catch (err) {
        next(err);
    }
}



//     Get Product Photo

exports.getPhoto = async (req, res, next) => {
    try {
        const photo = await productData.findById(req.params.pid).select("photo")
        if (photo.photo.data) {
            res.set("Content-type", photo.photo.contentType)
            return res.status(200).send(
                photo.photo.data
            )
        }
    } catch (err) {
        next(err)
    }
}


//  Delete Product

exports.updateProduct = async (req, res, next) => {
    try {
        const { name } = req.fields;
        const { photo } = req.files;

        if (photo && photo.size > 1000000) {
            return res.status(400).json({
                success: false,
                message: "Photo is required less then 1mb"
            });
        }

        const product = await productData.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        const savedProduct = await product.save();

        res.status(200).json({
            success: true,
            savedProduct,
            message: "Product have been updated successfully..."
        });
    } catch (err) {
        next(err)
    }
}

// ===========Search all products============

exports.serchAllProducts = async (req, res, next) => {
    try {
        const { keyword } = req.params
        const result = await productData.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select('-photo')

        res.status(200).json({
            success: true,
            result,
            message: "Product found successfully..."
        });

    } catch (err) {
        next(err)
        res.status(400).json({
            success: false,
            message: "Error in Search Api..."
        });
    }
}


// ====================Related Products=====================


exports.RelatedProducts = async (req, res, next) => {

    try {
        const { pid, cid } = req.params;
        const products = await productData.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-photo').populate('category').limit(12);

        res.status(200).json({
            success: true,
            products,
            message: "All Related Products"
        })

    } catch (error) {
        next(error)
        res.status(400).json({
            success: false,
            message: "Error in Search Related Products..."
        });
    }

}


exports.productCategory = async (req, res, next) => {
    try {

        const category = await crudData.findOne({ slug: req.params.slug });
        const product = await productData.find({ category }).populate('category');

        res.status(200).json({
            success: true,
            category,
            product,
            message: "product and category found"
        })

    } catch (error) {
        next(error)
        res.status(400).json({
            success: false,
            message: "Error in Related Products..."
        });
    }
}

//Payment Gateway Api

//token

exports.braintreeToken = async (req, res, next) => {
    try {

        gateway.clientToken.generate({}, function (err, responce) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: "Error in Genetrating token..."
                });
            } else {
                res.json({
                    success: true,
                    responce,
                    message: "token generated successfully"
                })
            }
        })

    } catch (error) {
        next(error);
        res.status(400).json({
            success: false,
            message: "Error in Braintree token..."
        });
    }
}

//payment

exports.braintreePayment = async (req, res, next) => {
    try {
        const { cart, nonce } = req.body;

        let total = 0;
        cart.map((i) => {
            total += i.price;
        })

        let newTransaction = await gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            }
        },
            function (error, result) {
                if (result) {
                    const order = new orderData({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save();

                    res.json({ ok: true })
                } else {
                    res.status(500).json({
                        ok: false,
                        message: 'Fail to save the order'
                    })
                }
            })

    } catch (error) {
        next(error);
        res.status(400).json({
            success: false,
            message: "Error in Braintree Payment..."
        });
    }
}


//Get Orders
exports.GetAllOrders = async (req, res, next) => {
    try {
        const orders = await orderData.find({ buyer: req.user._id }).populate('products', '-photo').populate('buyer', 'name');
        res.status(200).json({
            success: true,
            orders,
            messages: 'Get All Orders'
        })
    } catch (error) {
        next(error)
    }
}

// All Orders

exports.AllOrders = async (req, res, next) => {
    try {
        const orders = await orderData.find().populate('products', '-photo').populate('buyer', 'name').sort({ createdAt: '-1' });
        res.status(200).json({
            success: true,
            orders,
            messages: 'Get All Orders'
        })
    } catch (error) {
        next(error)
    }
}


exports.ChangeStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        const order = await orderData.findByIdAndUpdate(orderId,{ status },{ new: true })

        if (!order) {
            res.status(400).json({
                success:false,
                messages:'Update Failed'
            })
        }
       
        res.status(200).json({
            success: true,
            order,
            messages: 'Get All Orders'
        })

    } catch (error) {
        next(error)
        res.status(200).json({
            success: false,
            messages: 'Error in Status Updating'
        })
    }
}