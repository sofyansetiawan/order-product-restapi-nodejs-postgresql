const router = require("express").Router()
// const authentication = require("./middlewares/authentication")
// const authorization = require("./middlewares/authorization")

const {
    // ProductController,
    CustomerController
    // PaymentMethodController,
    // OrdersController
} = require("./controllers")

router.post("/register", CustomerController.register)
router.post("/login", CustomerController.login)

// router.get("/products", ProductController.showAll);
router.get("/customers", CustomerController.showAll);
// router.get("/paymentmethod", PaymentMethodController.showAll);

// router.use(authentication);
// router.get("/orders", authorization, OrdersController.showAll);
// router.post("/orders", authorization, OrdersController.add);

module.exports = router;