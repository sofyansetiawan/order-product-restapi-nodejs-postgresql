const jwt = require("jsonwebtoken")

const secret = "Sofyan2021" //* ini perlu pindahkan ke env

const generateToken = (data) => {
    return jwt.sign({phone_number: data.phone_number, email: data.email}, secret)
}

const verifyToken = (token) => {
    return jwt.verify(token, secret)
}

module.exports = { generateToken, verifyToken }