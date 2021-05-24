const Product = require("../models/productModel")

class ProductController {

    static showAll(req, res){
        Product.showAll((err, result) => {
            if (err) return res.status(500).json({message: err.message })
            res.status(200).json(result)
        })
    }
}

module.exports = ProductController