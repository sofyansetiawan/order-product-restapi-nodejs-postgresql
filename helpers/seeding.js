const fs = require("fs");
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
            const valueSQL = JSON.parse(result).map(item => {
                const values = []
                const dateNow = new Date().toISOString().split('T')[0]
                for (const field in item) {
                    if(field === "password"){
                        item["password"] = bcrypt.generatePassword(item["password"], item["salt"])
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

module.exports = jsonToSQLInsertVal