const getAllProductsDetails = `
SELECT

A.idProducto,
A.name,
A.description,
A.gross,
A.vat,
A.net,
COALESCE(MAX(A.urli),'/img/contracts/sin-imagen.png') AS urli,
COALESCE(A.benefits, 'Beneficios por definir.') AS benefits,
A.fundamentals

FROM (
	SELECT 
	prod.dim_productos_id AS idProducto,
	prod.dim_productos_nombre AS name,
	prod.dim_productos_descripcion AS description,

	prec.dim_precios_bruto AS gross,
	prec.dim_precios_iva AS vat,
	prec.dim_precios_neto AS net,
	urli.dim_urls_url AS urli,
    GROUP_CONCAT(DISTINCT ben.dim_beneficios_nombre ORDER BY ben.dim_beneficios_id ASC SEPARATOR '##')  AS benefits,
	fun.dim_fundamentos_nombre AS fundamentals
	FROM franquiciatdb.dim_productos prod
	INNER JOIN franquiciatdb.dim_precios prec ON (prod.dim_precios_id = prec.dim_precios_id)
    LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
    LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
    LEFT JOIN franquiciatdb.rel_productos_beneficios rpb ON (prod.dim_productos_id = rpb.dim_productos_id)
	LEFT JOIN franquiciatdb.dim_beneficios ben ON (rpb.dim_beneficios_id = ben.dim_beneficios_id)
	LEFT JOIN franquiciatdb.rel_productos_fundamentos rpf ON (prod.dim_productos_id = rpf.dim_productos_id)
	LEFT JOIN franquiciatdb.dim_fundamentos fun ON (rpf.dim_fundamentos_id = fun.dim_fundamentos_id)
	GROUP BY 
	prod.dim_productos_id,
	prod.dim_productos_nombre,
	prod.dim_productos_descripcion,
	prec.dim_precios_bruto,
	prec.dim_precios_iva,
	prec.dim_precios_neto

) AS A

GROUP BY

A.idProducto,
A.name,
A.description,
A.gross,
A.vat,
A.net,
A.benefits,
A.fundamentals
`
const getUsersAll = `
select 
dim_usuarios_detalles_nombres, 
dim_usuarios_detalles_apellidos, 
dim_usuarios_detalles_correo, 
dim_usuarios_detalles_telefono,
dim_usuarios_detalles_fechacreacion
from franquiciatdb.dim_usuarios_detalles dud 
where 
dud.dim_usuarios_detalles_nombres <> dud.dim_usuarios_detalles_apellidos 
and 
dud.dim_usuarios_detalles_telefono <> dud.dim_usuarios_id ;
`

const getOneProductsDetails = `
SELECT

A.idProducto,
A.name,
A.description,
A.gross,
A.vat,
A.net,
COALESCE(MAX(A.urli),'/img/contracts/sin-imagen.png') AS urli,
COALESCE(A.benefits, 'Beneficios por definir.') AS benefits,
A.fundamentals

FROM (
	SELECT 
	prod.dim_productos_id AS idProducto,
	prod.dim_productos_nombre AS name,
	prod.dim_productos_descripcion AS description,

	prec.dim_precios_bruto AS gross,
	prec.dim_precios_iva AS vat,
	prec.dim_precios_neto AS net,
	urli.dim_urls_url AS urli,
    GROUP_CONCAT(DISTINCT ben.dim_beneficios_nombre ORDER BY ben.dim_beneficios_id ASC SEPARATOR '##')  AS benefits,
	fun.dim_fundamentos_nombre AS fundamentals
	FROM franquiciatdb.dim_productos prod
	INNER JOIN franquiciatdb.dim_precios prec ON (prod.dim_precios_id = prec.dim_precios_id)
    LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
    LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
    LEFT JOIN franquiciatdb.rel_productos_beneficios rpb ON (prod.dim_productos_id = rpb.dim_productos_id)
	LEFT JOIN franquiciatdb.dim_beneficios ben ON (rpb.dim_beneficios_id = ben.dim_beneficios_id)
	LEFT JOIN franquiciatdb.rel_productos_fundamentos rpf ON (prod.dim_productos_id = rpf.dim_productos_id)
	LEFT JOIN franquiciatdb.dim_fundamentos fun ON (rpf.dim_fundamentos_id = fun.dim_fundamentos_id)
	GROUP BY 
	prod.dim_productos_id,
	prod.dim_productos_nombre,
	prod.dim_productos_descripcion,
	prec.dim_precios_bruto,
	prec.dim_precios_iva,
	prec.dim_precios_neto

) AS A
WHERE A.idProducto = ?
GROUP BY

A.idProducto,
A.name,
A.description,
A.gross,
A.vat,
A.net,
A.benefits,
A.fundamentals;
`

const getOneSubProductsDetails = `
SELECT
A.idProductoOriginal,
A.idProducto,
A.name,
A.description,
A.Nimagen,
A.gross,
A.vat,
A.net,

COALESCE(MAX(A.urli),'/img/contracts/sin-imagen.png') AS urli

FROM (
	SELECT 
    prodO.dim_productos_id AS idProductoOriginal,
	prod.dim_sub_productos_id AS idProducto,
	prod.dim_sub_productos_nombre AS name,
	prod.dim_sub_productos_descripcion AS description,
	prod.dim_sub_productos_Nimagen AS Nimagen,

	prec.dim_precios_bruto AS gross,
	prec.dim_precios_iva AS vat,
	prec.dim_precios_neto AS net,
	urli.dim_urls_url AS urli
    
	FROM franquiciatdb.dim_sub_productos prod
	INNER JOIN franquiciatdb.dim_precios prec ON (prod.dim_sub_precios_id = prec.dim_precios_id)
    
    INNER JOIN franquiciatdb.rel_subp_productos subP ON (prod.dim_sub_productos_id = subP.dim_sub_productos_id)
    INNER JOIN franquiciatdb.dim_productos prodO ON (subP.dim_productos_id = prodO.dim_productos_id)
    
    LEFT JOIN franquiciatdb.rel_urls_sub_productos rup ON (prod.dim_sub_productos_id = rup.dim_sub_productos_id)
    LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
	GROUP BY 
	prod.dim_sub_productos_id,
	prod.dim_sub_productos_nombre,
	prod.dim_sub_productos_descripcion,
	prod.dim_sub_productos_Nimagen,
	prec.dim_precios_bruto,
	prec.dim_precios_iva,
	prec.dim_precios_neto
	

) AS A
WHERE A.idProductoOriginal = ?
GROUP BY

A.idProducto,
A.name,
A.description,
A.Nimagen, 
A.gross,
A.vat,
A.net

`


const getProductsByTypes = `
SELECT
A.idProducto,
A.idCategorias,
A.nombre,
A.descripcion,
A.categorias,
A.categoriasString,
A.bruto,
A.iva,
A.neto,
COALESCE(MAX(A.urli),'assets/images/guias.jpg') AS urli,
MAX(A.urlv) AS urlv,
MAX(A.urlf) AS urlf,
COALESCE(A.beneficios, 'Beneficios por definir.') AS beneficios,
A.fundamentos
FROM (
SELECT
prod.dim_productos_id AS idProducto,
prod.dim_productos_nombre AS nombre,
prod.dim_productos_descripcion AS descripcion,
GROUP_CONCAT(DISTINCT cat.dim_categorias_id ORDER BY cat.dim_categorias_id ASC SEPARATOR ',') AS idCategorias,
GROUP_CONCAT(DISTINCT cat.dim_categorias_nombre ORDER BY cat.dim_categorias_id ASC SEPARATOR ',') AS categorias,
GROUP_CONCAT(DISTINCT cat.dim_categorias_nombre ORDER BY cat.dim_categorias_id ASC SEPARATOR ' ') AS categoriasString,
prec.dim_precios_bruto AS bruto,
prec.dim_precios_iva AS iva,
prec.dim_precios_neto AS neto,
urli.dim_urls_url AS urli,
urlv.dim_urls_url AS urlv,
urlf.dim_urls_url AS urlf,
GROUP_CONCAT(DISTINCT ben.dim_beneficios_nombre ORDER BY ben.dim_beneficios_id ASC SEPARATOR '##')  AS beneficios,
fun.dim_fundamentos_nombre AS fundamentos
FROM franquiciatdb.dim_productos prod
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id)
INNER JOIN franquiciatdb.rel_productos_categorias rpc ON (prod.dim_productos_id = rpc.dim_productos_id)
INNER JOIN franquiciatdb.dim_categorias cat ON (rpc.dim_categorias_id = cat.dim_categorias_id)
INNER JOIN franquiciatdb.rel_productos_precios rpp ON (prod.dim_productos_id = rpp.dim_productos_id)
INNER JOIN franquiciatdb.dim_precios prec ON (rpp.dim_precios_id = prec.dim_precios_id)
LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlv ON (urlv.dim_urls_tipo = 2 AND rup.dim_urls_id = urlv.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlf ON (urlf.dim_urls_tipo = 3 AND rup.dim_urls_id = urlf.dim_urls_id)
LEFT JOIN franquiciatdb.rel_productos_beneficios rpb ON (prod.dim_productos_id = rpb.dim_productos_id)
LEFT JOIN franquiciatdb.dim_beneficios ben ON (rpb.dim_beneficios_id = ben.dim_beneficios_id)
LEFT JOIN franquiciatdb.rel_productos_fundamentos rpf ON (prod.dim_productos_id = rpf.dim_productos_id)
LEFT JOIN franquiciatdb.dim_fundamentos fun ON (rpf.dim_fundamentos_id = fun.dim_fundamentos_id)
WHERE prod.dim_productos_activo = 1 AND tip.dim_tipos_nombres = ?
GROUP BY
prod.dim_productos_id,
prod.dim_productos_nombre,
prod.dim_productos_descripcion,
prec.dim_precios_bruto,
prec.dim_precios_iva,
prec.dim_precios_neto,
urli.dim_urls_url,
urlv.dim_urls_url,
urlf.dim_urls_url
) AS A
GROUP BY
A.idProducto,
A.idCategorias,
A.nombre,
A.descripcion,
A.categorias,
A.categoriasString,
A.bruto,
A.iva,
A.neto,
A.beneficios,
A.fundamentos
`

module.exports = { 
    getAllProductsDetails,
	getOneProductsDetails,
	getOneSubProductsDetails,
	getProductsByTypes,
	getUsersAll

} 