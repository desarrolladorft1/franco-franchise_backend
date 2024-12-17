const getShoppinCartByClient = `

SELECT
A.idTransaccion,
A.idProducto,
A.idProductoOriginal,
A.cantidad,
A.precio,
A.fecha,
A.idCliente,
A.name,
A.description,
A.gross,
A.vat,
A.net,
COALESCE(MAX(A.urli),'/img/contracts/sin-imagen.png') AS urli

FROM (
	SELECT
	prodO.dim_productos_id AS idProductoOriginal, 
	trx.trx_carrodecompras_id AS idTransaccion,
    trx.dim_clientes_id AS idCliente,
	trx.trx_carrodecompras_cantidad AS cantidad,
    trx.trx_carrodecompras_precio*trx.trx_carrodecompras_cantidad  AS precio,
	trx.trx_carrodecompras_fechacreacion AS fecha,
	subp.dim_productos_id AS idProducto,
	subp.dim_productos_nombre AS name,
	subp.dim_productos_descripcion AS description,

	prec.dim_precios_bruto AS gross,
	prec.dim_precios_iva AS vat,
	prec.dim_precios_neto AS net,
	urli.dim_urls_url AS urli
	FROM franquiciatdb.trx_carrodecompras trx
    INNER JOIN franquiciatdb.dim_productos subp ON (trx.dim_productos_id = subp.dim_productos_id)
	INNER JOIN franquiciatdb.dim_precios prec ON (subp.dim_precios_id = prec.dim_precios_id)
	INNER JOIN franquiciatdb.rel_subp_productos subrP ON (subp.dim_productos_id = subrP.dim_productos_id)
	INNER JOIN franquiciatdb.dim_productos prodO ON (subrP.dim_productos_id = prodO.dim_productos_id)

    LEFT JOIN franquiciatdb.rel_urls_productos rup ON (subp.dim_precios_id = rup.dim_productos_id)
    LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
	
    
    WHERE trx.trx_carrodecompras_estatus = "Cart"
)AS A
WHERE A.idCliente = ?
GROUP BY
A.idTransaccion;
`

const getCompraCarritoPorCliente = `
SELECT
A.idTransaccion,
A.idCliente,
A.idProducto,
A.estatus,
A.precio_unitario,
A.iva_unitario,
A.cantidad,
A.precio,
A.fecha,
A.producto_nombre,
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli,
A.usuario,
A.correo,
A.tipo,
A.examenId

FROM (

SELECT
trx.trx_carrodecompras_id AS idTransaccion,
trx.dim_clientes_id AS idCliente,
prod.dim_productos_id AS idProducto,
trx.trx_carrodecompras_estatus AS estatus,
prec.dim_precios_bruto AS precio_unitario,
prec.dim_precios_iva AS iva_unitario,
trx.trx_carrodecompras_cantidad AS cantidad,
trx.trx_carrodecompras_precio AS precio,
trx.trx_carrodecompras_fechacreacion AS fecha,
prod.dim_productos_nombre AS producto_nombre,
urli.dim_urls_url AS urli,
usu.dim_usuarios_usuario AS usuario,
usu.dim_usuarios_correo AS correo,
tip.dim_tipos_nombre AS tipo,
ex.dim_exam_id as examenId
FROM franquiciatdb.trx_carrodecompras trx
INNER JOIN franquiciatdb.dim_productos prod ON (trx.dim_productos_id = prod.dim_productos_id)
LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
INNER JOIN franquiciatdb.rel_productos_precios rpp ON (prod.dim_productos_id = rpp.dim_productos_id)
INNER JOIN franquiciatdb.dim_precios prec ON (rpp.dim_precios_id = prec.dim_precios_id)
INNER JOIN franquiciatdb.dim_usuarios usu ON (trx.dim_clientes_id = usu.dim_usuarios_id)

INNER JOIN franquiciatdb.rel_productos_tipos rtip ON (rtip.dim_productos_id = prod.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (tip.dim_tipos_id = rtip.dim_tipos_id)
LEFT JOIN franquiciatdb.rel_courses_exam coursesexam ON (coursesexam.dim_productos_id = prod.dim_productos_id)
LEFT JOIN franquiciatdb.dim_exam ex ON (ex.dim_exam_id = coursesexam.dim_exam_id)
WHERE trx.trx_carrodecompras_estatus = "Cart"

GROUP BY
trx.trx_carrodecompras_id,
trx.trx_carrodecompras_estatus,
prec.dim_precios_bruto,
prec.dim_precios_iva,
trx.trx_carrodecompras_cantidad,
trx.trx_carrodecompras_precio,
trx.trx_carrodecompras_fechacreacion,
urli.dim_urls_url,
usu.dim_usuarios_usuario,
usu.dim_usuarios_correo,
tip.dim_tipos_nombre

) AS A

WHERE A.idCliente = ?

GROUP BY

A.idTransaccion,
A.idCliente,
A.idProducto,
A.estatus,
A.precio_unitario,
A.iva_unitario,
A.cantidad,
A.precio,
A.fecha,
A.producto_nombre,
A.usuario,
A.correo
`

const setShoppinCart = `
INSERT INTO franquiciatdb.trx_carrodecompras (
dim_clientes_id,
dim_productos_id,
trx_carrodecompras_cantidad,
trx_carrodecompras_precio,
trx_num_firmas,
trx_carrodecompras_estatus,
trx_carrodecompras_fechacreacion
)
VALUES (
?,
?,
?,
?,
?,
"Cart",
CURDATE()
)
`

const deleteShoppinCart = `
DELETE FROM franquiciatdb.trx_carrodecompras 
WHERE trx_carrodecompras_id IN (?)
`

const deleteShoppintCartAfterBuying = `
DELETE FROM franquiciatdb.trx_carrodecompras 
WHERE CONCAT(dim_clientes_id,dim_productos_id) IN 
(SELECT CONCAT(trx.dim_clientes_id,trxd.dim_productos_id) 
FROM franquiciatdb.trx_transacciones trx
INNER JOIN franquiciatdb.trx_transaccionesdetalles trxd
ON (trx.trx_transacciones_id = trxd.trx_transacciones_id)
WHERE trx.trx_transacciones_id = ?)
`

const editShoppinCartStatusSQL = `
UPDATE franquiciatdb.trx_carrodecompras 
SET trx_carrodecompras_estatus = "En_Proceso"
WHERE trx_carrodecompras_id = ?;
`

module.exports = { getShoppinCartByClient,
				   getCompraCarritoPorCliente,
                   setShoppinCart,
                   deleteShoppinCart,
                   editShoppinCartStatusSQL,
                   deleteShoppintCartAfterBuying } 
