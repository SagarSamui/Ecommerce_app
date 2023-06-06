const validator = require('./userValidation');

const signup = async (req, res, next) => {
    const validationRule = {
        "email": "required|string|email",
        "name": "required|string",
        "address": "required|string",
        "password": "required|string|min:8",
        "phone": "required|string|min:8"
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
        } else {
            next();
        }
    }).catch(err => console.log(err))
}

module.exports = { signup };