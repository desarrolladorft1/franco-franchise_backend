const { Router } = require('express');

const { crearExcelInversionInicial } = require('./../controllers/excel');

const router = Router();

router.post("/llenarExcelInversionInicial", crearExcelInversionInicial);

module.exports = router;