const pool = require("../db")

class Product {

    constructor(product_id, product_name, basic_price, created_date){
        this.product_id = product_id
        this.product_name = product_name
        this.basic_price = basic_price
        this.created_date = created_date
    }

    static convertToInstance(data) {
        return data.map(row => new Product(row.product_id, row.product_name, row.basic_price, row.created_date))
    }

    static validate({
        product_name,
        basic_price,
        created_date
    }) {
        let errors = [];

        if (!product_name) {
            errors.push(`Product name is required`)
        } else if (product_name.length < 3) {
            errors.push(`Product name at least 3 characters`)
        }

        if (!basic_price) {
            errors.push(`Basic Price is required`)
        } else if (!basic_price.match(/[0-9]/gi)) {
            errors.push(`Basic Price is invalid`)
        }

        if (!created_date) {
            errors.push(`created date is required`)
        }

        return errors
    }

    static showAll(callback){
        const sql = `
            SELECT 
                p.product_id,
                p.product_name,
                p.basic_price,
                SUM(od.qty) AS ordered
            FROM 
                "Products" AS p
            LEFT JOIN
                "OrderDetails" AS od
            ON
                p.product_id = od.product_id
            GROUP BY 
                p.product_id
            ORDER BY
                ordered;
        `;
        pool.query(sql, (err, result) => {
            if (err) return callback(err, null)
            callback(null, result.rows)
        })
    }
}

module.exports = Product;