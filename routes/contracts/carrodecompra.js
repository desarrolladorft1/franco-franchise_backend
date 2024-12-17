const { Router } = require('express');
const { getShoppinCartPorCliente,
        getCarritoPorCliente,
        setShoppinCartNew,
        setShoppinCartDelete,
        editShoppinCartStatus } = require('../../controllers/contracts/carrodecompra');

const router = Router();

router.post("/getShoppinCartClient", getShoppinCartPorCliente );
router.post("/getCarritoCliente", getCarritoPorCliente );
router.post("/shoppinCartNew", setShoppinCartNew );
router.post("/shoppinCartDelete", setShoppinCartDelete );
router.post("/shoppinCartEditStatus", editShoppinCartStatus );

module.exports = router;