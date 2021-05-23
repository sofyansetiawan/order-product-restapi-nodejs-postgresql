const Customer = require("../models/customerModel")
const bcrypt = require("../helpers/bcrypt")
const { generateToken, comparePassword } = require("../helpers/jwt")

class CustomerController {
    static login(req, res){
        const { email, password } = req.body;
        Customer.findEmail(email, (err, result) => {
            if(err) return res.status(400).json({ message: "Invalid Email/Password" })
            if(!result || !bcrypt.comparePassword(password, result.password)){
                res.status(400).json({ message: "Invalid Email/Password" })
            }
            const access_token = generateToken(result);
            res.status(200).json({ access_token })
        })
    }

    static register(req, res){
        const payload = {
            customer_name: req.body.customer_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            dob: req.body.dob,
            sex: req.body.sex,
            salt: req.body.salt,
            password: req.body.password,
            created_date: new Date().toISOString().split('T')[0]
        }
        const errors = Customer.validate(payload);
        if(errors.length > 0) return res.status(400).json(errors)
        payload.password = bcrypt.generatePassword(payload.password, payload.salt)
        Customer.register(payload, (err, result) => {
            if(err) return res.status(500).send(err)
            res.status(200).json(result)
        })
    }

    static showAll(req, res){
        Customer.showAll((err, result) => {
            if (err) return res.status(500).json({message: err.message })
            res.status(200).json(result)
        })
    }
}

module.exports = CustomerController