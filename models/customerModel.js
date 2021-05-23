const pool = require("../db");

// * needs convert to promise based using async-await

class Customer {

    constructor(customer_id, customer_name, email, phone_number, dob, sex, salt, password, created_date) {
        this.customer_id = customer_id
        this.customer_name = customer_name
        this.email = email
        this.phone_number = phone_number
        this.dob = dob
        this.sex = sex
        this.salt = salt
        this.password = password
        this.created_date = created_date
    }

    static validate({
        customer_name,
        email,
        phone_number,
        dob,
        sex,
        salt,
        password,
        created_date
    }) {
        let errors = [];

        if (!customer_name) {
            errors.push(`Customer name is required`)
        } else if (customer_name.length < 3) {
            errors.push(`Customer name at least 3 characters`)
        }

        if (!email) {
            errors.push(`Email is required`)
        } else if (!email.match(/[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]/)) {
            errors.push(`Invalid email format`)
        }

        if (!dob) {
            errors.push(`Dob is required`)
        }

        if (!salt) {
            errors.push(`Salt is required`)
        }

        if (!phone_number) {
            errors.push(`Phone number is required`)
        }

        if (sex == null || sex == undefined) {
            errors.push(`Sex is required`)
        }

        if (!created_date) {
            errors.push(`created date is required`)
        }

        if (!password) {
            errors.push(`Password is required`)
        } else if (password.length < 3) {
            errors.push(`Password at least 3 characters`)
        }

        return errors
    }

    static convertToInstance(data) {
        return data.map(row => new Customer(row.customer_id, row.customer_name, row.email, row.phone_number, row.dob, row.sex, row.salt, row.password, row.created_date))
    }

    static showAll(callback) {
        const sql = `
            SELECT
                c.customer_id,
                c.customer_name,
                c.email,
                COUNT(o.customer_id) AS orders,
                SUM(pro.total) AS total_money
            FROM 
                "Customers" AS c
            LEFT JOIN
                "Orders" AS o
            ON 
                o.customer_id = c.customer_id
            LEFT JOIN
            (
                SELECT
                    od.product_id,
                    od.order_id,
                    SUM(p.basic_price * od.qty) AS total
                FROM 
                    "Products" AS p
                LEFT JOIN
                    "OrderDetails" AS od
                ON
                    p.product_id = od.product_id
                GROUP BY
                    od.product_id, od.order_id
            ) AS pro
            ON
                o.order_id = pro.order_id
            GROUP BY 
                c.customer_id;
        `;
        pool.query(sql, (err, result) => {
            if (err) return callback(err, null)
            callback(null, result.rows)
        })
    }

    static register(userData, callback) {
        const {
            customer_name,
            email,
            phone_number,
            dob,
            sex,
            salt,
            password,
            created_date
        } = userData;
        const sql = `INSERT INTO "Customers" (
            customer_name, email, phone_number, dob, sex, salt, password, created_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
        const values = [customer_name, email, phone_number, dob, sex, salt, password, created_date];
        pool.query(sql, values, (err, result) => {
            if (err) return callback(err, null)
            callback(null, Customer.convertToInstance(result.rows).pop())
        })
    }

    static findEmail(email, callback) {
        const sqlSelect = `
            SELECT * FROM "Customers" WHERE email = $1;
        `
        const values = [email];
        pool.query(sqlSelect, values, (err, result) => {
            if (err) return callback(err, null)
            else{
                callback(null, Customer.convertToInstance(result.rows).pop())
            }
        })
    }

}

module.exports = Customer