const setShoppinCart = `
INSERT INTO franquiciatdb.trx_carrodecompras (
dim_clientes_id,
dim_productos_id,
trx_carrodecompras_cantidad,
trx_carrodecompras_precio
)
VALUES (
?,
?,
?,
?
)
`

const deleteShoppinCart = `
DELETE FROM franquiciatdb.trx_carrodecompras 
WHERE trx_carrodecompras_id IN (?)
`

const editShoppinCartStatusSQL = `
UPDATE franquiciatdb.trx_carrodecompras 
SET trx_carrodecompras_estatus = "En_Proceso"
WHERE trx_carrodecompras_id = ?;
`

module.exports = { setShoppinCart,
                   deleteShoppinCart,
                   editShoppinCartStatusSQL } 
