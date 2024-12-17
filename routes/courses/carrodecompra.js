const { Router } = require('express');
const { setShoppinCartNew,
        setShoppinCartDelete,
        editShoppinCartStatus } = require('../../controllers/courses/carrodecompra');

const router = Router();

router.post("/shoppinCartNew", setShoppinCartNew );
router.post("/shoppinCartDelete", setShoppinCartDelete );
router.post("/shoppinCartEditStatus", editShoppinCartStatus );

module.exports = router;