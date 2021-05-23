const pool = require("./db")
const jsonToSQLInsertVal = require("./helpers/seeding")

const fileCustomers = `./json/customers.json`;
const fileProducts = `./json/products.json`;
const filePaymentMethods = `./json/payment_methods.json`;
const fileOrders = `./json/orders.json`;
const fileOrderDetails = `./json/order_detail.json`;

// * needs to change to promise
// * to avoid callback hell

jsonToSQLInsertVal(fileCustomers, true, (err, result) => {
    if(err) throw err
    else {
        const sql = `INSERT INTO "Customers" ("customer_name", "email", "phone_number", "dob", "sex", "salt", "password", "created_date") VALUES ${result}`;
        pool.query(sql, (err, _) => {
            if(err) throw err
            console.log(`seeding data customers successfully`);
            jsonToSQLInsertVal(fileProducts, true, (err, result) => {
                if(err) throw err
                else {
                    const sql = `INSERT INTO "Products" ("product_name", "basic_price", "created_date") VALUES ${result}`;
                    pool.query(sql, (err, _) => {
                        if(err) throw err
                        console.log(`seeding data customers successfully`);
                        jsonToSQLInsertVal(filePaymentMethods, true, (err, result) => {
                            if(err) throw err
                            else {
                                const sql = `INSERT INTO "PaymentMethods" ("method_name", "code", "created_date") VALUES ${result}`;
                                pool.query(sql, (err, _) => {
                                    if(err) throw err
                                    console.log(`seeding data payment methods successfully`);
                                    jsonToSQLInsertVal(fileOrders, false, (err, result) => {
                                        if(err) throw err
                                        else {
                                            const sql = `INSERT INTO "Orders" ("customer_id", "order_number", "order_date", "payment_method_id") VALUES ${result}`;
                                            pool.query(sql, (err, _) => {
                                                if(err) throw err
                                                console.log(`seeding data orders successfully`);
                                                jsonToSQLInsertVal(fileOrderDetails, true, (err, result) => {
                                                    if(err) throw err
                                                    else {
                                                        const sql = `INSERT INTO "OrderDetails" ("order_id", "product_id", "qty", "created_date") VALUES ${result}`;
                                                        pool.query(sql, (err, _) => {
                                                            if(err) throw err
                                                            console.log(`seeding data order details successfully`);
                                                            pool.end();
                                                        })
                                                    }
                                                })
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    })
                }
            })
        })
    }
})