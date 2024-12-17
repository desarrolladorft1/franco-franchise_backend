const { Router } = require('express');

const {
    getContacto
} = require('../../controllers/appointments/contacto');

const router = Router();

router.post("/postContacto", getContacto);

module.exports = router;