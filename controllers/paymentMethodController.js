const PaymentMethod = require("../models/paymentMethodModel")

class PaymentMethodController {

    static showAll(req, res){
        PaymentMethod.showAll((err, result) => {
            if (err) return res.status(500).json({message: err.message })
            res.status(200).json(result)
        })
    }
}

module.exports = PaymentMethodController