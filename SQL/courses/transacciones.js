const getTransactionsDetailsByClientCourses = `
SELECT

A.idTransaccion,
A.idTransaccionDetalle,
A.idCliente,
A.idProducto,
A.tipo,
A.estatus,
A.neto,
A.pagado,
A.fecha,
A.detalle_estatusValor,
A.detalle_estatusNombre,
A.detalle_neto,
A.nombre,
A.descripcion,
A.rating,
A.categoriasString,
A.learn,
A.requirements,
A.includes,
A.course_for,
A.dueno,
A.job,
A.avatar,
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli,
MAX(A.urlc) AS urlc,
MAX(A.urlv) AS urlv,
A.rel_productos_cursos_rating,
A.rel_productos_cursos_rating_comment,
A.examenId

FROM (

SELECT
trx.trx_transacciones_id AS idTransaccion,
trxd.trx_transaccionesdetalles_id AS idTransaccionDetalle,
trx.dim_usuarios_id AS idCliente,
prod.dim_productos_id AS idProducto,
trx.trx_transacciones_tipo AS tipo,
trx.trx_transacciones_estatus AS estatus,
trx.trx_transacciones_neto AS neto,
trx.trx_transacciones_pagado AS pagado,
trx.trx_transacciones_fechacreacion AS fecha,
trxe.trx_estatus_valor AS detalle_estatusValor,
trxe.trx_estatus_nombre AS detalle_estatusNombre,
trxd.trx_transaccionesdetalles_neto AS detalle_neto,


prod.dim_productos_nombre AS nombre,
prod.dim_productos_descripcion AS descripcion,
ra.rating AS rating,

procur.dim_productos_cursos_dueno AS dueno,
procur.dim_productos_cursos_dueno_job AS job,
procur.dim_productos_cursos_avatar AS avatar,

procur.dim_productos_cursos_what_you_will_learn AS learn,
procur.dim_productos_cursos_requirements AS requirements,
procur.dim_productos_cursos_this_course_includes AS includes,
procur.dim_productos_cursos_who_is_this_course_for AS course_for,
GROUP_CONCAT(DISTINCT cat.dim_categorias_nombre ORDER BY cat.dim_categorias_id ASC SEPARATOR ' ') AS categoriasString,

dra.rel_productos_cursos_rating,
dra.rel_productos_cursos_rating_comment,

urlv.dim_urls_url AS urlv,
urli.dim_urls_url AS urli,
urlc.dim_urls_url AS urlc,
ex.dim_exam_id as examenId

FROM franquiciatdb.trx_transacciones trx
INNER JOIN franquiciatdb.trx_transaccionesdetalles trxd ON (trx.trx_transacciones_id = trxd.trx_transacciones_id)
INNER JOIN franquiciatdb.trx_estatus trxe ON (trxd.trx_transaccionesdetalles_estatus = trxe.trx_estatus_id)
INNER JOIN franquiciatdb.dim_productos prod ON (trxd.dim_productos_id = prod.dim_productos_id)
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id)

INNER JOIN franquiciatdb.rel_productos_categorias rpc ON (prod.dim_productos_id = rpc.dim_productos_id)
INNER JOIN franquiciatdb.dim_categorias cat ON (rpc.dim_categorias_id = cat.dim_categorias_id)

LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlv ON (urlv.dim_urls_tipo = 6 AND rup.dim_urls_id = urlv.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlc ON (urlc.dim_urls_tipo = 5 AND rup.dim_urls_id = urlc.dim_urls_id)
LEFT JOIN franquiciatdb.rel_productos_cursos rpcur ON (prod.dim_productos_id = rpcur.dim_productos_id)
LEFT JOIN franquiciatdb.dim_productos_cursos procur ON (rpcur.dim_productos_cursos_id = procur.dim_productos_cursos_id)
LEFT JOIN (
	SELECT dr.dim_productos_id
	,AVG(dr.rel_productos_cursos_rating) AS rating
	,count(dr.rel_productos_cursos_rating_comment) AS cantOpiniones
    FROM franquiciatdb.rel_dim_productos_cursos_rating AS dr
	GROUP BY dr.dim_productos_id
) AS ra ON prod.dim_productos_id = ra.dim_productos_id
LEFT JOIN franquiciatdb.rel_dim_productos_cursos_rating dra ON (dra.dim_productos_id = prod.dim_productos_id 
															  AND dra.dim_usuarios_id = trx.dim_usuarios_id  )

LEFT JOIN franquiciatdb.rel_courses_exam coursesexam ON (coursesexam.dim_productos_id = prod.dim_productos_id)
LEFT JOIN franquiciatdb.dim_exam ex ON (ex.dim_exam_id = coursesexam.dim_exam_id)

WHERE tip.dim_tipos_nombres IN ('Cursos')
GROUP BY
trx.trx_transacciones_id,
trxd.trx_transaccionesdetalles_id,
trx.trx_transacciones_tipo,
trx.trx_transacciones_estatus,
trx.trx_transacciones_neto,
trx.trx_transacciones_pagado,
trx.trx_transacciones_fechacreacion,
trxd.trx_transaccionesdetalles_estatus,
trxd.trx_transaccionesdetalles_neto,
prod.dim_productos_nombre,
prod.dim_productos_descripcion,
procur.dim_productos_cursos_dueno,
procur.dim_productos_cursos_dueno_job,
procur.dim_productos_cursos_avatar,
procur.dim_productos_cursos_rating,
procur.dim_productos_cursos_what_you_will_learn,
procur.dim_productos_cursos_requirements,
procur.dim_productos_cursos_this_course_includes,
procur.dim_productos_cursos_who_is_this_course_for,
urli.dim_urls_url,
urlc.dim_urls_url
) AS A
WHERE A.idCliente = ?
GROUP BY
A.idTransaccion,
A.idTransaccionDetalle,
A.idProducto,
A.tipo,
A.estatus,
A.neto,
A.pagado,
A.fecha,
A.detalle_estatusValor,
A.detalle_estatusNombre,
A.detalle_neto,
A.nombre,
A.descripcion,
A.rating,
A.categoriasString,
A.learn,
A.requirements,
A.includes,
A.course_for;
`



const getTransactionsDetailsByClientCoursesSpecify = `
SELECT

A.idTransaccion,
A.idTransaccionDetalle,
A.idCliente,
A.idProducto,
A.tipo,
A.estatus,
A.neto,
A.pagado,
A.fecha,
A.detalle_estatusValor,
A.detalle_estatusNombre,
A.detalle_neto,
A.nombre,
A.descripcion,
A.rating,
A.categoriasString,
A.learn,
A.requirements,
A.includes,
A.course_for,
A.dueno,
A.job,
A.avatar,
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli,
MAX(A.urlc) AS urlc,
MAX(A.urlv) AS urlv,
A.rel_productos_cursos_rating,
A.rel_productos_cursos_rating_comment,
A.certificadoCompletacion,
A.certificadoAprobacion,
A.nombreCliente,
A.examenId

FROM (

SELECT

trx.trx_transacciones_id AS idTransaccion,
trxd.trx_transaccionesdetalles_id AS idTransaccionDetalle,
trx.dim_clientes_id AS idCliente,
prod.dim_productos_id AS idProducto,
trx.trx_transacciones_tipo AS tipo,
trx.trx_transacciones_estatus AS estatus,
trx.trx_transacciones_neto AS neto,
trx.trx_transacciones_pagado AS pagado,
trx.trx_transacciones_fechacreacion AS fecha,
trxe.trx_estatus_valor AS detalle_estatusValor,
trxe.trx_estatus_nombre AS detalle_estatusNombre,
trxd.trx_transaccionesdetalles_neto AS detalle_neto,

prod.dim_productos_nombre AS nombre,
prod.dim_productos_descripcion AS descripcion,
ra.rating AS rating,

procur.dim_productos_cursos_dueno AS dueno,
procur.dim_productos_cursos_dueno_job AS job,
procur.dim_productos_cursos_avatar AS avatar,

procur.dim_productos_cursos_what_you_will_learn AS learn,
procur.dim_productos_cursos_requirements AS requirements,
procur.dim_productos_cursos_this_course_includes AS includes,
procur.dim_productos_cursos_who_is_this_course_for AS course_for,
GROUP_CONCAT(DISTINCT cat.dim_categorias_nombre ORDER BY cat.dim_categorias_id ASC SEPARATOR ' ') AS categoriasString,

dra.rel_productos_cursos_rating,
dra.rel_productos_cursos_rating_comment,

urlv.dim_urls_url AS urlv,
urli.dim_urls_url AS urli,
urlc.dim_urls_url AS urlc,
ex.dim_exam_id as examenId,

pdfc.trx_pdf_id AS certificadoCompletacion,
pdfa.trx_pdf_id AS certificadoAprobacion,

CONCAT(udet.dim_usuarios_detalles_nombres, ' ', udet.dim_usuarios_detalles_apellidos) AS nombreCliente

FROM franquiciatdb.trx_transacciones trx
INNER JOIN franquiciatdb.trx_transaccionesdetalles trxd ON (trx.trx_transacciones_id = trxd.trx_transacciones_id)
INNER JOIN franquiciatdb.dim_usuarios_detalles udet ON (trx.dim_usuarios_id = udet.dim_usuarios_id)
INNER JOIN franquiciatdb.trx_estatus trxe ON (trxd.trx_transaccionesdetalles_estatus = trxe.trx_estatus_id)
INNER JOIN franquiciatdb.dim_productos prod ON (trxd.dim_productos_id = prod.dim_productos_id)
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id)

INNER JOIN franquiciatdb.rel_productos_categorias rpc ON (prod.dim_productos_id = rpc.dim_productos_id)
INNER JOIN franquiciatdb.dim_categorias cat ON (rpc.dim_categorias_id = cat.dim_categorias_id)

LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlv ON (urlv.dim_urls_tipo = 6 AND rup.dim_urls_id = urlv.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlc ON (urlc.dim_urls_tipo = 5 AND rup.dim_urls_id = urlc.dim_urls_id)
LEFT JOIN franquiciatdb.rel_productos_cursos rpcur ON (prod.dim_productos_id = rpcur.dim_productos_id)
LEFT JOIN franquiciatdb.dim_productos_cursos procur ON (rpcur.dim_productos_cursos_id = procur.dim_productos_cursos_id)
LEFT JOIN (
SELECT dr.dim_productos_id, AVG(dr.rel_productos_cursos_rating) AS rating, count(dr.rel_productos_cursos_rating_comment) AS cantOpiniones
FROM franquiciatdb.rel_dim_productos_cursos_rating AS dr GROUP BY dr.dim_productos_id
) AS ra ON (prod.dim_productos_id = ra.dim_productos_id)
LEFT JOIN franquiciatdb.rel_dim_productos_cursos_rating dra ON (dra.dim_productos_id = prod.dim_productos_id AND dra.dim_usuarios_id = trx.dim_clientes_id  )
LEFT JOIN franquiciatdb.trx_pdf pdfc ON (trxd.trx_transaccionesdetalles_id = pdfc.trx_transaccionesdetalles_id AND pdfc.trx_pdf_url LIKE '%Completacion%')
LEFT JOIN franquiciatdb.trx_pdf pdfa ON (trxd.trx_transaccionesdetalles_id = pdfa.trx_transaccionesdetalles_id AND pdfa.trx_pdf_url LIKE '%Aprobacion%')
LEFT JOIN franquiciatdb.rel_courses_exam coursesexam ON (coursesexam.dim_productos_id = prod.dim_productos_id)
LEFT JOIN franquiciatdb.dim_exam ex ON (ex.dim_exam_id = coursesexam.dim_exam_id)
															  
WHERE tip.dim_tipos_nombres IN ('Cursos')
GROUP BY
trx.trx_transacciones_id,
trxd.trx_transaccionesdetalles_id,
trx.trx_transacciones_tipo,
trx.trx_transacciones_estatus,
trx.trx_transacciones_neto,
trx.trx_transacciones_pagado,
trx.trx_transacciones_fechacreacion,
trxd.trx_transaccionesdetalles_estatus,
trxd.trx_transaccionesdetalles_neto,
prod.dim_productos_nombre,
prod.dim_productos_descripcion,
procur.dim_productos_cursos_dueno,
procur.dim_productos_cursos_dueno_job,
procur.dim_productos_cursos_avatar,
procur.dim_productos_cursos_rating,
procur.dim_productos_cursos_what_you_will_learn,
procur.dim_productos_cursos_requirements,
procur.dim_productos_cursos_this_course_includes,
procur.dim_productos_cursos_who_is_this_course_for,
urli.dim_urls_url,
urlc.dim_urls_url,
pdfc.trx_pdf_url,
pdfa.trx_pdf_url
) AS A
WHERE A.idCliente = ? AND A.idProducto = ?
GROUP BY
A.idTransaccion,
A.idTransaccionDetalle,
A.idProducto,
A.tipo,
A.estatus,
A.neto,
A.pagado,
A.fecha,
A.detalle_estatusValor,
A.detalle_estatusNombre,
A.detalle_neto,
A.nombre,
A.descripcion,
A.rating,
A.categoriasString,
A.learn,
A.requirements,
A.includes,
A.course_for
`

const guathCheckCoursesSQL = `
SELECT

A.idCliente,
A.idProducto,
A.tipo,
A.estatus,
A.pagado,
A.fecha,
A.detalle_estatusValor,
A.detalle_estatusNombre,
A.detalle_neto,
A.nombre,
A.descripcion,
A.rating,
A.categoriasString,
A.dueno,
A.job,
A.avatar,
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli,
MAX(A.urlc) AS urlc

FROM (
SELECT
trx.dim_usuarios_id AS idCliente,
prod.dim_productos_id AS idProducto,
trx.trx_transacciones_tipo AS tipo,
trx.trx_transacciones_estatus AS estatus,
trx.trx_transacciones_pagado AS pagado,
trx.trx_transacciones_fechacreacion AS fecha,
trxe.trx_estatus_valor AS detalle_estatusValor,
trxe.trx_estatus_nombre AS detalle_estatusNombre,
trxd.trx_transaccionesdetalles_neto AS detalle_neto,
prod.dim_productos_nombre AS nombre,
prod.dim_productos_descripcion AS descripcion,
procur.dim_productos_cursos_rating AS rating,
procur.dim_productos_cursos_dueno AS dueno,
procur.dim_productos_cursos_dueno_job AS job,
procur.dim_productos_cursos_avatar AS avatar,
GROUP_CONCAT(DISTINCT cat.dim_categorias_nombre ORDER BY cat.dim_categorias_id ASC SEPARATOR ' ') AS categoriasString,
urli.dim_urls_url AS urli,
urlc.dim_urls_url AS urlc
FROM franquiciatdb.trx_transacciones trx
INNER JOIN franquiciatdb.trx_transaccionesdetalles trxd ON (trx.trx_transacciones_id = trxd.trx_transacciones_id)
INNER JOIN franquiciatdb.trx_estatus trxe ON (trxd.trx_transaccionesdetalles_estatus = trxe.trx_estatus_id)
INNER JOIN franquiciatdb.dim_productos prod ON (trxd.dim_productos_id = prod.dim_productos_id)
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id)
INNER JOIN franquiciatdb.rel_productos_categorias rpc ON (prod.dim_productos_id = rpc.dim_productos_id)
INNER JOIN franquiciatdb.dim_categorias cat ON (rpc.dim_categorias_id = cat.dim_categorias_id)
LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlc ON (urlc.dim_urls_tipo = 5 AND rup.dim_urls_id = urlc.dim_urls_id)
LEFT JOIN franquiciatdb.rel_productos_cursos rpcur ON (prod.dim_productos_id = rpcur.dim_productos_id)
LEFT JOIN franquiciatdb.dim_productos_cursos procur ON (rpcur.dim_productos_cursos_id = procur.dim_productos_cursos_id)
WHERE tip.dim_tipos_nombres IN ('Cursos')
GROUP BY
trx.trx_transacciones_tipo,
trx.trx_transacciones_estatus,
trx.trx_transacciones_neto,
trx.trx_transacciones_pagado,
trx.trx_transacciones_fechacreacion,
trxd.trx_transaccionesdetalles_estatus,
trxd.trx_transaccionesdetalles_neto,
prod.dim_productos_nombre,
prod.dim_productos_descripcion,
procur.dim_productos_cursos_dueno,
procur.dim_productos_cursos_dueno_job,
procur.dim_productos_cursos_avatar,
procur.dim_productos_cursos_rating,
procur.dim_productos_cursos_what_you_will_learn,
procur.dim_productos_cursos_requirements,
procur.dim_productos_cursos_this_course_includes,
procur.dim_productos_cursos_who_is_this_course_for,
urli.dim_urls_url,
urlc.dim_urls_url
) AS A
WHERE A.idCliente = ? AND A.idProducto = ?
GROUP BY
A.idProducto
`

module.exports = {
    getTransactionsDetailsByClientCourses,
    guathCheckCoursesSQL,
	getTransactionsDetailsByClientCoursesSpecify
}
  
