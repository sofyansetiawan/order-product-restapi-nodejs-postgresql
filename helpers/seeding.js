const fs = require("fs");
const toRoman = require("roman-numerals").toRoman;
const bcrypt = require("../helpers/bcrypt");

// * needs to change to promise

function jsonToSQLInsertVal(path, isCreatedDate, callback, excludes = ["id"]) {
    fs.readFile(path, {
        encoding: "utf-8"
    }, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const excludeField = new Set(excludes);
            let index = 1;
            const valueSQL = JSON.parse(result).map(item => {
                const values = []
                const dateNow = new Date().toISOString().split('T')[0]
                for (const field in item) {
                    if(field === "password"){
                        item["password"] = bcrypt.generatePassword(item["password"], item["salt"])
                    }
                    if(field === "order_number"){
                        item["order_number"] = convertOrder(item["order_date"], index)
                        index++;
                    }
                    if (!excludeField.has(field)) values.push(`'${item[field]}'`)
                }
                if (isCreatedDate) values.push(`'${dateNow}'`)
                return `(${values.join(", ")})`
            }).join(", ")

            callback(null, valueSQL)
        }
    })
}

const convertOrder = (order_date = "2001-01-01", index = 1) => {
    let year = order_date.split("-")[0]
    let month = toRoman(order_date.split("-")[1]);
    return `PO-${index}/${month}/${year}`

}

module.exports = jsonToSQLInsertVal