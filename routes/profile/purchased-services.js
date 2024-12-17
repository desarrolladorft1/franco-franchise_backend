const { Router } = require('express');

const {
    getPurchasedServicesByUser
} = require('../../controllers/profile/purchased-services');

const router = Router();

router.post("/purchased-services", getPurchasedServicesByUser);

module.exports = router;