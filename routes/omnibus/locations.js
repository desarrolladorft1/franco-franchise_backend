const { Router } = require('express');

const {
    getStates,
    getMunicipalities 
} = require('../../controllers/omnibus/locations');

const router = Router();

router.get("/locations/states", getStates);
router.get("/locations/municipalities", getMunicipalities);

module.exports = router;