const router = require("express").Router()

const {
    ProductController,
    CustomerController,
    PaymentMethodController
} = require("./controllers")

router.post("/register", CustomerController.register)
router.post("/login", CustomerController.login)

router.get("/products", ProductController.showAll);
router.get("/customers", CustomerController.showAll);
router.get("/paymentmethod", PaymentMethodController.showAll);

module.exports = router;