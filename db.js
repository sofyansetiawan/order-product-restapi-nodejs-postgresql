const { Pool } = require("pg")

// * need to add host, db, user, password to .env
const pool = new Pool({
    host: "localhost",
    database: "database_testing_order",
    user: "postgres",
    password: "postgres",
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 1000
})

module.exports = pool

