const { Router } = require('express');

const {
    getFinanciamiento
} = require('../../controllers/appointments/financiamiento');

const router = Router();

router.post("/postFinanciamiento", getFinanciamiento);

module.exports = router;