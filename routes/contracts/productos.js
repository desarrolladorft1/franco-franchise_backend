const { Router } = require('express');
const { getAllProductoDetalleSQL,
        getOneProductoDetalle,
        getOneSubProductsDetailsSQL, 
        getAllUsersDetalleSQL,
        getProductosPorTipo} = require('../../controllers/contracts/productos');

const router = Router();

router.get("/allProductos", getAllProductoDetalleSQL );
router.post("/oneProductos", getOneProductoDetalle );
router.post("/oneSubProductos", getOneSubProductsDetailsSQL );

router.post("/productosPorTipo", getProductosPorTipo );

router.post("/allUsuarios", getAllUsersDetalleSQL );

module.exports = router;