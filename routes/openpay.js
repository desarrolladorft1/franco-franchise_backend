const { Router } = require('express');
const { openpayNewCustomer,
        openpayDeleteCustomer,
        openpayNewCharges, 
        openpayWebhook} = require('../controllers/openpay');

const router = Router();

// router.post("/NewClient", openpayNewCustomer)
// router.post("/DeleteClient", openpayDeleteCustomer)

router.post("/NewCharges", openpayNewCharges)
router.post("/Webhook", openpayWebhook)

module.exports = router;