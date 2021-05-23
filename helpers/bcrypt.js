const bcrypt = require("bcryptjs")

const generatePassword = (userpassword, saltPassword = 10) => {
    let salt = bcrypt.genSaltSync(saltPassword);
    return bcrypt.hashSync(userpassword, salt);
}

const comparePassword = (passwordInput, passwordDatabase) => {
    return bcrypt.compareSync(passwordInput, passwordDatabase);
}

module.exports = {generatePassword, comparePassword}