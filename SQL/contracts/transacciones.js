const setTransaction = `
INSERT INTO franquiciatdb.trx_transacciones (
dim_abogados_id,
dim_clientes_id,
dim_usuarios_id, 
trx_transacciones_neto
)
VALUES (
?,
?,
?,
?
)
`

const setTransactionDetails = `
INSERT INTO franquiciatdb.trx_transaccionesdetalles (
trx_transacciones_id, 
dim_productos_id,
dim_sub_productos_id,
trx_transaccionesdetalles_neto
)
VALUES (?,?,?,?)
`

const setTransactionDetails2 = `
INSERT INTO franquiciatdb.trx_transaccionesdetalles (
trx_transacciones_id, 
dim_productos_id,
trx_transaccionesdetalles_neto
)
VALUES ?
`

const getAssignedLawyer = `
SELECT 
CONCAT(abog.dim_abogados_nombres,' ',abog.dim_abogados_apellidos) AS abogado,
abog.dim_abogados_nombres AS nombres
FROM franquiciatdb.trx_transacciones trx
JOIN franquiciatdb.dim_abogados abog ON (trx.dim_abogados_id = abog.dim_abogados_id)
WHERE trx.trx_transacciones_id = ?
`

const getLawyerToAssign = `
SELECT
abog.dim_abogados_id AS idAbogados,
COUNT(trx.dim_abogados_id) AS asignados
FROM franquiciatdb.dim_abogados abog
LEFT JOIN franquiciatdb.trx_transacciones trx ON (abog.dim_abogados_id = trx.dim_abogados_id)
GROUP BY abog.dim_abogados_id
ORDER BY COUNT(trx.dim_abogados_id)
LIMIT 1
`

module.exports = { 
    setTransaction, 
    setTransactionDetails,
    setTransactionDetails2,
    getAssignedLawyer,
    getLawyerToAssign
}