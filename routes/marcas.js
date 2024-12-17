const { Router } = require('express');

const {
   
    getMarcas
} = require('../controllers/appointments/marcas');

const router = Router();

router.post("/postMarcas", getMarcas);

module.exports = router;