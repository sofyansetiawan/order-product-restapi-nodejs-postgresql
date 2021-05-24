const pool = require("./db")

// * untuk delete harus dipisahkan per tabel atau hapus manual saja

const dropTable = `DROP TABLE IF EXISTS "OrderDetails", "Orders", "PaymentMethods", "Products", "Customers";`;

const createCustomers = `
    CREATE TABLE IF NOT EXISTS "Customers" (
        "customer_id" SERIAL PRIMARY KEY,
        "customer_name" VARCHAR(50) NOT NULL,
        "phone_number" VARCHAR(20) UNIQUE NOT NULL,
        "email" VARCHAR(50) UNIQUE NOT NULL,
        "dob" DATE NOT NULL,
        "sex" BOOLEAN NOT NULL,
        "salt" VARCHAR(80) NOT NULL,
        "password" VARCHAR(400) NOT NULL,
        "created_date" TIMESTAMP NOT NULL
    );
`;

const createProducts = `
    CREATE TABLE IF NOT EXISTS "Products" (
        "product_id" SERIAL PRIMARY KEY,
        "product_name" VARCHAR(80),
        "basic_price" BIGINT,
        "created_date" TIMESTAMP
    );
`;

const createPaymentMethods = `
    CREATE TABLE IF NOT EXISTS "PaymentMethods" (
        "payment_method_id" SERIAL PRIMARY KEY,
        "method_name" VARCHAR(70) NOT NULL,
        "code" VARCHAR(10) NOT NULL,
        "created_date" TIMESTAMP
    );
`;

const createOrders = `
    CREATE TABLE IF NOT EXISTS "Orders" (
        "order_id" SERIAL PRIMARY KEY,
        "customer_id" INTEGER NOT NULL REFERENCES "PaymentMethods" ("payment_method_id") ON DElETE CASCADE,
        "order_number" VARCHAR(40) NOT NULL,
        "order_date" TIMESTAMP,
        "payment_method_id" INTEGER NOT NULL REFERENCES "PaymentMethods" ("payment_method_id") ON DElETE CASCADE
    );
`;

const createOrderDetails = `
    CREATE TABLE IF NOT EXISTS "OrderDetails" (
        "order_detail_id" SERIAL PRIMARY KEY,
        "order_id" INTEGER NOT NULL REFERENCES "Orders" (order_id) ON DELETE CASCADE,
        "product_id" INTEGER NOT NULL REFERENCES "Products" (product_id) ON DELETE CASCADE,
        "qty" INTEGER,
        "created_date" TIMESTAMP
    );
`;

pool.query(dropTable, (err, _) => {
    if (err) throw err
    console.log("Drop table success")

    pool.query(createCustomers, (err, _) => {
        if (err) throw err
        console.log("Created customer successfully")

        pool.query(createProducts, (err, _) => {
            if (err) throw err
            console.log("Created products successfully")

            pool.query(createPaymentMethods, (err, _) => {
                if (err) throw err
                console.log("Created payment methods successfully")

                pool.query(createOrders, (err, _) => {
                    if(err) throw err
                    console.log("Created order successfully")

                    pool.query(createOrderDetails, (err, _) => {
                        if(err) throw err
                        console.log("Created order detail successfully")
                        pool.end()
                    })
                })
            })
        })
    })
})