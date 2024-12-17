const { Router } = require('express');
const { setTransaccionDetalles, 
        setTransaccionDetallesCitas, 
        setTransaccion, 
        setTransaccionDetallesCursos,
        setTransaccionDetalles2} = require('../../controllers/contracts/transacciones');

const router = Router();

router.post("/transacciones", setTransaccion)
router.post("/transacciones/detalles", setTransaccionDetalles)
router.post("/transacciones/detallesCitas", setTransaccionDetallesCitas)
router.post("/transacciones/detalles2", setTransaccionDetalles2)
router.post("/transacciones/detallesCursos", setTransaccionDetallesCursos)

module.exports = router;