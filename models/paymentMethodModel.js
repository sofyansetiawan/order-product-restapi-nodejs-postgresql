const pool = require("../db")

class PaymentMethod {

    constructor(payment_method_id, method_name, code, created_date){
        this.payment_method_id = payment_method_id
        this.method_name = method_name
        this.code = code
        this.created_date = created_date
    }

    static convertToInstance(data) {
        return data.map(row => new PaymentMethod(row.payment_method_id, row.method_name, row.code, row.created_date))
    }

    static validate({
        method_name,
        code,
        created_date
    }) {
        let errors = [];

        if (!method_name) {
            errors.push(`Method name is required`)
        } else if (method_name.length < 3) {
            errors.push(`Method name at least 3 characters`)
        }

        if (!code) {
            errors.push(`Code is required`)
        } else if (!code.match(/[a-zA-Z0-9]/gi)) {
            errors.push(`Code is invalid`)
        }

        if (!created_date) {
            errors.push(`created date is required`)
        }

        return errors
    }

    static showAll(callback){
        const sql = `
        SELECT 
            pm.method_name,
            pm.code,
            SUM(pm.payment_method_id) AS count  
        FROM 
            "PaymentMethods" AS pm
        LEFT JOIN
            "Orders" AS o
        ON
            pm.payment_method_id = o.payment_method_id
        GROUP BY 
            pm.payment_method_id
        ORDER BY
            count DESC;
        `;
        pool.query(sql, (err, result) => {
            if (err) return callback(err, null)
            callback(null, result.rows)
        })
    }
}

module.exports = PaymentMethod;