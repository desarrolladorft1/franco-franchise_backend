const getAllCoursesSQL = `
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
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli,
MAX(A.urlv) AS urlv,
COALESCE(A.beneficios, 'Beneficios por definir.') AS beneficios,
A.fundamentos,
A.dueno,
A.job,
A.avatar,
A.rating,
A.learn,
A.requirements,
A.includes,
A.course_for,
A.tipo,
A.examenId

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
GROUP_CONCAT(DISTINCT ben.dim_beneficios_nombre ORDER BY ben.dim_beneficios_id ASC SEPARATOR '##')  AS beneficios,
fun.dim_fundamentos_nombre AS fundamentos,
procur.dim_productos_cursos_dueno AS dueno,
procur.dim_productos_cursos_dueno_job AS job,
procur.dim_productos_cursos_avatar AS avatar,
ra.rating AS rating,
procur.dim_productos_cursos_what_you_will_learn AS learn,
procur.dim_productos_cursos_requirements AS requirements,
procur.dim_productos_cursos_this_course_includes AS includes,
procur.dim_productos_cursos_who_is_this_course_for AS course_for,
tip.dim_tipos_nombres AS tipo,
ex.dim_exam_id as examenId

FROM franquiciatdb.dim_productos prod
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id)
INNER JOIN franquiciatdb.rel_productos_categorias rpc ON (prod.dim_productos_id = rpc.dim_productos_id)
INNER JOIN franquiciatdb.dim_categorias cat ON (rpc.dim_categorias_id = cat.dim_categorias_id)
INNER JOIN franquiciatdb.rel_productos_precios rpp ON (prod.dim_productos_id = rpp.dim_productos_id)
INNER JOIN franquiciatdb.dim_precios prec ON (rpp.dim_precios_id = prec.dim_precios_id)
LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlv ON (urlv.dim_urls_tipo = 6 AND rup.dim_urls_id = urlv.dim_urls_id)
LEFT JOIN franquiciatdb.rel_productos_beneficios rpb ON (prod.dim_productos_id = rpb.dim_productos_id)
LEFT JOIN franquiciatdb.dim_beneficios ben ON (rpb.dim_beneficios_id = ben.dim_beneficios_id)
LEFT JOIN franquiciatdb.rel_productos_fundamentos rpf ON (prod.dim_productos_id = rpf.dim_productos_id)
LEFT JOIN franquiciatdb.dim_fundamentos fun ON (rpf.dim_fundamentos_id = fun.dim_fundamentos_id)
LEFT JOIN franquiciatdb.rel_productos_cursos rpcur ON (prod.dim_productos_id = rpcur.dim_productos_id)
LEFT JOIN franquiciatdb.dim_productos_cursos procur ON (rpcur.dim_productos_cursos_id = procur.dim_productos_cursos_id)
LEFT JOIN (
	SELECT dr.dim_productos_id
	,AVG(dr.rel_productos_cursos_rating) AS rating
	,count(dr.rel_productos_cursos_rating_comment) AS cantOpiniones
    FROM franquiciatdb.rel_dim_productos_cursos_rating AS dr
	GROUP BY dr.dim_productos_id
) AS ra ON prod.dim_productos_id = ra.dim_productos_id

LEFT JOIN franquiciatdb.rel_courses_exam coursesexam ON (coursesexam.dim_productos_id = prod.dim_productos_id)
LEFT JOIN franquiciatdb.dim_exam ex ON (ex.dim_exam_id = coursesexam.dim_exam_id)

WHERE prod.dim_productos_activo = 1 AND tip.dim_tipos_nombres = 'Cursos'
GROUP BY 
prod.dim_productos_id,
prod.dim_productos_nombre,
prod.dim_productos_descripcion,
prec.dim_precios_bruto,
prec.dim_precios_iva,
prec.dim_precios_neto,
urli.dim_urls_url,
urlv.dim_urls_url,
procur.dim_productos_cursos_dueno,
procur.dim_productos_cursos_dueno_job,
procur.dim_productos_cursos_avatar,
procur.dim_productos_cursos_rating,
procur.dim_productos_cursos_what_you_will_learn,
procur.dim_productos_cursos_requirements,
procur.dim_productos_cursos_this_course_includes,
procur.dim_productos_cursos_who_is_this_course_for,
tip.dim_tipos_nombres

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
A.fundamentos,
A.dueno,
A.job,
A.avatar,
A.rating,
A.learn,
A.requirements,
A.includes,
A.course_for;
`
const getOneCourseSQL =  ` 
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
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli,
MAX(A.urlv) AS urlv,
COALESCE(A.beneficios, 'Beneficios por definir.') AS beneficios,
A.fundamentos,
A.dueno,
A.job,
A.avatar,
A.rating,
A.learn,
A.requirements,
A.includes,
A.course_for,
A.tipo,
A.examenId

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
GROUP_CONCAT(DISTINCT ben.dim_beneficios_nombre ORDER BY ben.dim_beneficios_id ASC SEPARATOR '##')  AS beneficios,
fun.dim_fundamentos_nombre AS fundamentos,
procur.dim_productos_cursos_dueno AS dueno,
procur.dim_productos_cursos_dueno_job AS job,
procur.dim_productos_cursos_avatar AS avatar,
ra.rating AS rating,
procur.dim_productos_cursos_what_you_will_learn AS learn,
procur.dim_productos_cursos_requirements AS requirements,
procur.dim_productos_cursos_this_course_includes AS includes,
procur.dim_productos_cursos_who_is_this_course_for AS course_for,
tip.dim_tipos_nombres AS tipo,
ex.dim_exam_id as examenId

FROM franquiciatdb.dim_productos prod
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id)
INNER JOIN franquiciatdb.rel_productos_categorias rpc ON (prod.dim_productos_id = rpc.dim_productos_id)
INNER JOIN franquiciatdb.dim_categorias cat ON (rpc.dim_categorias_id = cat.dim_categorias_id)
INNER JOIN franquiciatdb.rel_productos_precios rpp ON (prod.dim_productos_id = rpp.dim_productos_id)
INNER JOIN franquiciatdb.dim_precios prec ON (rpp.dim_precios_id = prec.dim_precios_id)
LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlv ON (urlv.dim_urls_tipo = 6 AND rup.dim_urls_id = urlv.dim_urls_id)
LEFT JOIN franquiciatdb.rel_productos_beneficios rpb ON (prod.dim_productos_id = rpb.dim_productos_id)
LEFT JOIN franquiciatdb.dim_beneficios ben ON (rpb.dim_beneficios_id = ben.dim_beneficios_id)
LEFT JOIN franquiciatdb.rel_productos_fundamentos rpf ON (prod.dim_productos_id = rpf.dim_productos_id)
LEFT JOIN franquiciatdb.dim_fundamentos fun ON (rpf.dim_fundamentos_id = fun.dim_fundamentos_id)
LEFT JOIN franquiciatdb.rel_productos_cursos rpcur ON (prod.dim_productos_id = rpcur.dim_productos_id)
LEFT JOIN franquiciatdb.dim_productos_cursos procur ON (rpcur.dim_productos_cursos_id = procur.dim_productos_cursos_id)
LEFT JOIN (
	SELECT dr.dim_productos_id
	,AVG(dr.rel_productos_cursos_rating) AS rating
	,count(dr.rel_productos_cursos_rating_comment) AS cantOpiniones
    FROM franquiciatdb.rel_dim_productos_cursos_rating AS dr
	GROUP BY dr.dim_productos_id
) AS ra ON prod.dim_productos_id = ra.dim_productos_id

LEFT JOIN franquiciatdb.rel_courses_exam coursesexam ON (coursesexam.dim_productos_id = prod.dim_productos_id)
LEFT JOIN franquiciatdb.dim_exam ex ON (ex.dim_exam_id = coursesexam.dim_exam_id)

WHERE prod.dim_productos_activo = 1 AND tip.dim_tipos_nombres = 'Cursos' AND prod.dim_productos_id = ?
GROUP BY 
prod.dim_productos_id,
prod.dim_productos_nombre,
prod.dim_productos_descripcion,
prec.dim_precios_bruto,
prec.dim_precios_iva,
prec.dim_precios_neto,
urli.dim_urls_url,
urlv.dim_urls_url,
procur.dim_productos_cursos_dueno,
procur.dim_productos_cursos_dueno_job,
procur.dim_productos_cursos_avatar,
procur.dim_productos_cursos_rating,
procur.dim_productos_cursos_what_you_will_learn,
procur.dim_productos_cursos_requirements,
procur.dim_productos_cursos_this_course_includes,
procur.dim_productos_cursos_who_is_this_course_for,
tip.dim_tipos_nombres

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
A.fundamentos,
A.dueno,
A.job,
A.avatar,
A.rating,
A.learn,
A.requirements,
A.includes,
A.course_for;

`

const getCursoCompradoSQL = ` 
SELECT

trxa.trx_transacciones_id,
trx_transaccionesdetalles_id,
dim_clientes_id,
dim_productos_id

FROM franquiciatdb.trx_transacciones trxa

INNER JOIN franquiciatdb.trx_transaccionesdetalles trxd ON (trxd.trx_transacciones_id = trxa.trx_transacciones_id)

WHERE dim_clientes_id = ? AND dim_productos_id = ?

` 

const getComentarioSQL =  ` 
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
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli,
MAX(A.urlv) AS urlv,
COALESCE(A.beneficios, 'Beneficios por definir.') AS beneficios,
A.fundamentos,
A.dueno,
A.job,
A.avatar,
A.rating,
A.comment,
A.learn,
A.requirements,
A.includes,
A.course_for,
A.tipo,
A.examenId

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
GROUP_CONCAT(DISTINCT ben.dim_beneficios_nombre ORDER BY ben.dim_beneficios_id ASC SEPARATOR '##')  AS beneficios,
fun.dim_fundamentos_nombre AS fundamentos,
procur.dim_productos_cursos_dueno AS dueno,
procur.dim_productos_cursos_dueno_job AS job,
procur.dim_productos_cursos_avatar AS avatar,
ra.rating AS rating,
co.rel_productos_cursos_rating_comment as comment,
procur.dim_productos_cursos_what_you_will_learn AS learn,
procur.dim_productos_cursos_requirements AS requirements,
procur.dim_productos_cursos_this_course_includes AS includes,
procur.dim_productos_cursos_who_is_this_course_for AS course_for,
tip.dim_tipos_nombres AS tipo,
ex.dim_exam_id as examenId

FROM franquiciatdb.dim_productos prod
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id)
INNER JOIN franquiciatdb.rel_productos_categorias rpc ON (prod.dim_productos_id = rpc.dim_productos_id)
INNER JOIN franquiciatdb.dim_categorias cat ON (rpc.dim_categorias_id = cat.dim_categorias_id)
INNER JOIN franquiciatdb.rel_productos_precios rpp ON (prod.dim_productos_id = rpp.dim_productos_id)
INNER JOIN franquiciatdb.dim_precios prec ON (rpp.dim_precios_id = prec.dim_precios_id)
LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlv ON (urlv.dim_urls_tipo = 6 AND rup.dim_urls_id = urlv.dim_urls_id)
LEFT JOIN franquiciatdb.rel_productos_beneficios rpb ON (prod.dim_productos_id = rpb.dim_productos_id)
LEFT JOIN franquiciatdb.dim_beneficios ben ON (rpb.dim_beneficios_id = ben.dim_beneficios_id)
LEFT JOIN franquiciatdb.rel_productos_fundamentos rpf ON (prod.dim_productos_id = rpf.dim_productos_id)
LEFT JOIN franquiciatdb.dim_fundamentos fun ON (rpf.dim_fundamentos_id = fun.dim_fundamentos_id)
LEFT JOIN franquiciatdb.rel_productos_cursos rpcur ON (prod.dim_productos_id = rpcur.dim_productos_id)
LEFT JOIN franquiciatdb.dim_productos_cursos procur ON (rpcur.dim_productos_cursos_id = procur.dim_productos_cursos_id)
LEFT JOIN (
	SELECT dr.dim_productos_id
	,AVG(dr.rel_productos_cursos_rating) AS rating
	,count(dr.rel_productos_cursos_rating_comment) AS cantOpiniones
    FROM franquiciatdb.rel_dim_productos_cursos_rating AS dr
	GROUP BY dr.dim_productos_id
) AS ra ON prod.dim_productos_id = ra.dim_productos_id
INNER JOIN franquiciatdb.rel_dim_productos_cursos_rating co ON (prod.dim_productos_id = co.dim_productos_id)

LEFT JOIN franquiciatdb.rel_courses_exam coursesexam ON (coursesexam.dim_productos_id = prod.dim_productos_id)
LEFT JOIN franquiciatdb.dim_exam ex ON (ex.dim_exam_id = coursesexam.dim_exam_id)

WHERE prod.dim_productos_activo = 1 AND tip.dim_tipos_nombres = 'Cursos' AND prod.dim_productos_id = ?
GROUP BY 
prod.dim_productos_id,
prod.dim_productos_nombre,
prod.dim_productos_descripcion,
prec.dim_precios_bruto,
prec.dim_precios_iva,
prec.dim_precios_neto,
urli.dim_urls_url,
urlv.dim_urls_url,
procur.dim_productos_cursos_dueno,
procur.dim_productos_cursos_dueno_job,
procur.dim_productos_cursos_avatar,
procur.dim_productos_cursos_rating,
co.rel_productos_cursos_rating_comment,
procur.dim_productos_cursos_what_you_will_learn,
procur.dim_productos_cursos_requirements,
procur.dim_productos_cursos_this_course_includes,
procur.dim_productos_cursos_who_is_this_course_for,
tip.dim_tipos_nombres

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
A.fundamentos,
A.dueno,
A.job,
A.avatar,
A.rating,
A.comment,
A.learn,
A.requirements,
A.includes,
A.course_for;

`

const getAllCoursesWithActiveSQL = `
SELECT

A.idProducto,
A.Activo,
A.idCategorias,
A.nombre,
A.descripcion,
A.categorias,
A.categoriasString,
A.bruto,
A.iva,
A.neto,
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli,
MAX(A.urlv) AS urlv,
COALESCE(A.beneficios, 'Beneficios por definir.') AS beneficios,
A.fundamentos,
A.dueno,
A.job,
A.avatar,
A.rating,
A.learn,
A.requirements,
A.includes,
A.course_for,
A.tipo

FROM (

SELECT 
prod.dim_productos_id AS idProducto,
prod.dim_productos_activo AS Activo,
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
GROUP_CONCAT(DISTINCT ben.dim_beneficios_nombre ORDER BY ben.dim_beneficios_id ASC SEPARATOR '##')  AS beneficios,
fun.dim_fundamentos_nombre AS fundamentos,
procur.dim_productos_cursos_dueno AS dueno,
procur.dim_productos_cursos_dueno_job AS job,
procur.dim_productos_cursos_avatar AS avatar,
ra.rating AS rating,
procur.dim_productos_cursos_what_you_will_learn AS learn,
procur.dim_productos_cursos_requirements AS requirements,
procur.dim_productos_cursos_this_course_includes AS includes,
procur.dim_productos_cursos_who_is_this_course_for AS course_for,
tip.dim_tipos_nombres AS tipo
FROM franquiciatdb.dim_productos prod
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id)
INNER JOIN franquiciatdb.rel_productos_categorias rpc ON (prod.dim_productos_id = rpc.dim_productos_id)
INNER JOIN franquiciatdb.dim_categorias cat ON (rpc.dim_categorias_id = cat.dim_categorias_id)
INNER JOIN franquiciatdb.rel_productos_precios rpp ON (prod.dim_productos_id = rpp.dim_productos_id)
INNER JOIN franquiciatdb.dim_precios prec ON (rpp.dim_precios_id = prec.dim_precios_id)
LEFT JOIN franquiciatdb.rel_urls_productos rup ON (prod.dim_productos_id = rup.dim_productos_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND rup.dim_urls_id = urli.dim_urls_id)
LEFT JOIN franquiciatdb.dim_urls urlv ON (urlv.dim_urls_tipo = 6 AND rup.dim_urls_id = urlv.dim_urls_id)
LEFT JOIN franquiciatdb.rel_productos_beneficios rpb ON (prod.dim_productos_id = rpb.dim_productos_id)
LEFT JOIN franquiciatdb.dim_beneficios ben ON (rpb.dim_beneficios_id = ben.dim_beneficios_id)
LEFT JOIN franquiciatdb.rel_productos_fundamentos rpf ON (prod.dim_productos_id = rpf.dim_productos_id)
LEFT JOIN franquiciatdb.dim_fundamentos fun ON (rpf.dim_fundamentos_id = fun.dim_fundamentos_id)
LEFT JOIN franquiciatdb.rel_productos_cursos rpcur ON (prod.dim_productos_id = rpcur.dim_productos_id)
LEFT JOIN franquiciatdb.dim_productos_cursos procur ON (rpcur.dim_productos_cursos_id = procur.dim_productos_cursos_id)
LEFT JOIN (
	SELECT dr.dim_productos_id
	,AVG(dr.rel_productos_cursos_rating) AS rating
	,count(dr.rel_productos_cursos_rating_comment) AS cantOpiniones
    FROM franquiciatdb.rel_dim_productos_cursos_rating AS dr
	GROUP BY dr.dim_productos_id
) AS ra ON prod.dim_productos_id = ra.dim_productos_id
WHERE tip.dim_tipos_nombres = 'Cursos'
GROUP BY 
prod.dim_productos_id,
prod.dim_productos_nombre,
prod.dim_productos_descripcion,
prec.dim_precios_bruto,
prec.dim_precios_iva,
prec.dim_precios_neto,
urli.dim_urls_url,
urlv.dim_urls_url,
procur.dim_productos_cursos_dueno,
procur.dim_productos_cursos_dueno_job,
procur.dim_productos_cursos_avatar,
procur.dim_productos_cursos_rating,
procur.dim_productos_cursos_what_you_will_learn,
procur.dim_productos_cursos_requirements,
procur.dim_productos_cursos_this_course_includes,
procur.dim_productos_cursos_who_is_this_course_for,
tip.dim_tipos_nombres

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
A.fundamentos,
A.dueno,
A.job,
A.avatar,
A.rating,
A.learn,
A.requirements,
A.includes,
A.course_for;
`

const getCoursesPorCategoriasSQL = `
CALL franquiciatdb.filter_courses(?,?,?,?);
`

const getCategoriesCoursesSQL = `
SELECT

A.idCategoria,
A.nombre,
A.descripcion,
COALESCE(MAX(A.urli),'assets/img/sin-imagen.png') AS urli

FROM (

SELECT 
cat.dim_categorias_id AS idCategoria,
cat.dim_categorias_nombre AS nombre,
cat.dim_categorias_descripcion AS descripcion,
urli.dim_urls_url AS urli
FROM franquiciatdb.dim_categorias cat
INNER JOIN franquiciatdb.rel_categorias_tipos rct ON (cat.dim_categorias_id = rct.dim_categorias_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rct.dim_tipos_id = tip.dim_tipos_id)
LEFT JOIN franquiciatdb.rel_urls_categoria ruc ON (cat.dim_categorias_id = ruc.dim_categorias_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (urli.dim_urls_tipo = 1 AND ruc.dim_urls_id = urli.dim_urls_id)
WHERE cat.dim_categorias_activo = 1 AND tip.dim_tipos_nombres = 'Cursos'
GROUP BY 
cat.dim_categorias_id,
cat.dim_categorias_nombre,
cat.dim_categorias_descripcion,
urli.dim_urls_url

) AS A

GROUP BY
A.idCategoria,
A.nombre,
A.descripcion
`

const getCoursesContentHeaderSQL = `
SELECT 

A.idProducto,
A.nombreProducto,
A.idProductoContent,
A.nombre,
A.total_clases,
A.total_tiempo,
A.name_detail,
A.total_tiempo_detail,
A.urli AS urli,
A.id_detail

FROM (

SELECT 
prod.dim_productos_id AS idProducto,
prod.dim_productos_nombre AS nombreProducto,
rpc.dim_productos_content_id AS idProductoContent,
rpc.dim_productos_content_name AS nombre,
rpc.dim_productos_content_total_clases AS total_clases,
rpc.dim_productos_content_total_tiempo AS total_tiempo,
mzr.dim_productos_content_detaill_name AS name_detail,
mzr.dim_productos_content_detaill_total_tiempo AS total_tiempo_detail,
mzr.dim_productos_content_detaill_id AS id_detail,
urli.dim_urls_url AS urli

FROM franquiciatdb.dim_productos prod
INNER JOIN franquiciatdb.rel_productos_productos_content xzr ON (prod.dim_productos_id = xzr.dim_productos_id)
INNER JOIN franquiciatdb.dim_productos_content rpc ON (rpc.dim_productos_content_id = xzr.dim_productos_content_id)
INNER JOIN franquiciatdb.rel_dim_productos_content_detaill czr ON (czr.dim_productos_content_id = rpc.dim_productos_content_id)
INNER JOIN franquiciatdb.dim_productos_content_detaill mzr ON (mzr.dim_productos_content_detaill_id = czr.dim_productos_content_detaill_id)
INNER JOIN franquiciatdb.rel_url_productos_content_detail deta ON (deta.dim_productos_content_detaill_id = mzr.dim_productos_content_detaill_id)
LEFT JOIN franquiciatdb.dim_urls urli ON (deta.dim_urls_id = urli.dim_urls_id)


GROUP BY 
prod.dim_productos_id,
prod.dim_productos_nombre,
rpc.dim_productos_content_id,
rpc.dim_productos_content_name,
rpc.dim_productos_content_total_clases,
rpc.dim_productos_content_total_tiempo,
mzr.dim_productos_content_detaill_name,
mzr.dim_productos_content_detaill_total_tiempo,
urli.dim_urls_url
) AS A

WHERE A.idProducto IN (?)

GROUP BY
A.idProducto,
A.nombreProducto,
A.idProductoContent,
A.nombre,
A.total_clases,
A.total_tiempo,
A.name_detail,
A.total_tiempo_detail
`

const getCoursesContentHeaderWithUserSQL = `
SELECT 

A.idProducto,
A.nombreProducto,
A.idProductoContent,
A.nombre,
A.total_clases,
A.total_tiempo,
A.name_detail,
A.total_tiempo_detail,
A.urli AS urli,
A.id_detail,
A.courses_minute,
A.viewed,
A.User_id
FROM (

SELECT 
prod.dim_productos_id AS idProducto,
prod.dim_productos_nombre AS nombreProducto,
rpc.dim_productos_content_id AS idProductoContent,
rpc.dim_productos_content_name AS nombre,
rpc.dim_productos_content_total_clases AS total_clases,
rpc.dim_productos_content_total_tiempo AS total_tiempo,
mzr.dim_productos_content_detaill_id AS id_detail,
mzr.dim_productos_content_detaill_name AS name_detail,
mzr.dim_productos_content_detaill_total_tiempo AS total_tiempo_detail,
urli.dim_urls_url AS urli,

usuar_det.courses_minute AS courses_minute,
usuar_det.viewed AS viewed,
usuar.dim_usuarios_id AS User_id

FROM franquiciatdb.dim_productos prod
INNER JOIN franquiciatdb.rel_productos_productos_content xzr ON (prod.dim_productos_id = xzr.dim_productos_id)
INNER JOIN franquiciatdb.dim_productos_content rpc ON (rpc.dim_productos_content_id = xzr.dim_productos_content_id)
INNER JOIN franquiciatdb.rel_dim_productos_content_detaill czr ON (czr.dim_productos_content_id = rpc.dim_productos_content_id)
INNER JOIN franquiciatdb.dim_productos_content_detaill mzr ON (mzr.dim_productos_content_detaill_id = czr.dim_productos_content_detaill_id)
INNER JOIN franquiciatdb.rel_url_productos_content_detail deta ON (deta.dim_productos_content_detaill_id = mzr.dim_productos_content_detaill_id)

LEFT JOIN franquiciatdb.rel_dim_productos_content_detaill_usuario usuar_det ON (usuar_det.dim_productos_content_detaill_id = mzr.dim_productos_content_detaill_id)
LEFT JOIN franquiciatdb.dim_usuarios usuar ON (usuar_det.dim_usuarios_id = usuar_det.dim_usuarios_id)

LEFT JOIN franquiciatdb.dim_urls urli ON (deta.dim_urls_id = urli.dim_urls_id)


GROUP BY 
prod.dim_productos_id,
prod.dim_productos_nombre,
rpc.dim_productos_content_id,
rpc.dim_productos_content_name,
rpc.dim_productos_content_total_clases,
rpc.dim_productos_content_total_tiempo,
mzr.dim_productos_content_detaill_id,
mzr.dim_productos_content_detaill_name,
mzr.dim_productos_content_detaill_total_tiempo,
urli.dim_urls_url,
usuar_det.courses_minute,
usuar_det.viewed,
usuar.dim_usuarios_id
) AS A

WHERE A.idProducto IN (?) AND A.User_id IN (?)

GROUP BY
A.idProducto,
A.nombreProducto,
A.idProductoContent,
A.nombre,
A.total_clases,
A.total_tiempo,
A.name_detail,
A.total_tiempo_detail
`

const setViewedXUser = `
UPDATE franquiciatdb.rel_dim_productos_content_detaill_usuario
SET viewed = ?
WHERE dim_productos_content_detaill_id = ? AND dim_usuarios_id = ? 
`

const setUser_Viewed = `
CALL franquiciatdb.InsertIfExist(?, ?);
`

const getCommentXCoursesSQL = `
SELECT
A.ID,
A.dim_padre,
A.header,
A.fechacreacion,
A.clike,
A.nro_like,
A.idCliente,
A.dim_usuarios_usuario,
A.dim_comment,
A.idProducto,
A.nameProducto,
A.nombres,
A.apellidos,
A.email
FROM (
SELECT
trxd.dim_comment_user_id AS ID,
trx.dim_padre_id AS dim_padre,
trx.dim_comment_user_header AS header,
trx.rel_fechacreacion AS fechacreacion,
trx.dim_comment_nro_like AS nro_like,
userd.dim_usuarios_id AS idCliente,
userd.dim_usuarios_correo AS email,
userd.dim_usuarios_usuario AS dim_usuarios_usuario,
trx.dim_comment_user AS dim_comment,
prod.dim_productos_id AS idProducto,
prod.dim_productos_nombre AS nameProducto,
dud.dim_usuarios_detalles_nombres AS nombres,
dud.dim_usuarios_detalles_apellidos AS apellidos,
lik.dim_usuarios_comment_like AS clike

FROM franquiciatdb.dim_comment_user trx
INNER JOIN franquiciatdb.rel_dim_comment_user_person trxd ON (trxd.dim_comment_user_id = trx.dim_comment_user_id)
INNER JOIN franquiciatdb.rel_dim_comment_user_producto cpro ON (cpro.dim_comment_user_id = trx.dim_comment_user_id)
INNER JOIN franquiciatdb.dim_usuarios userd ON (userd.dim_usuarios_id = trxd.dim_usuarios_id)
INNER JOIN franquiciatdb.dim_productos prod ON (prod.dim_productos_id = cpro.dim_productos_id)
INNER JOIN franquiciatdb.dim_usuarios_detalles dud ON (userd.dim_usuarios_id = dud.dim_usuarios_id)
LEFT JOIN franquiciatdb.rel_dim_comment_user_person_like lik ON (	lik.dim_usuarios_id = ?
																AND lik.dim_comment_user_id = trx.dim_comment_user_id )
) AS A
WHERE A.idProducto = ?
ORDER BY
	A.dim_padre
`

const setCommentXCoursesSQL = `
INSERT INTO franquiciatdb.dim_comment_user (
dim_comment_user_header,
dim_comment_user
)
VALUES (
?,
?
)
`

const setCommentXCoursesSonSQL = `
INSERT INTO franquiciatdb.dim_comment_user (
dim_padre_id,
dim_comment_user
)
VALUES (
?,
?
)
`

const setCommentXCoursesRel_UserSQL = `
INSERT INTO franquiciatdb.rel_dim_comment_user_person (
dim_comment_user_id,
dim_usuarios_id
)
VALUES (
?,
?
)
`

const setCommentXCoursesRel_ProductSQL = `
INSERT INTO franquiciatdb.rel_dim_comment_user_producto (
dim_comment_user_id,
dim_productos_id
)
VALUES (
?,
?
)
`

const getCommentXCoursesLikeSQL = `
SELECT * 
FROM franquiciatdb.rel_dim_comment_user_person_like L
WHERE L.dim_comment_user_id= ? AND L.dim_usuarios_id = ?
`

const setCommentXCoursesLikeSQL = `
INSERT INTO franquiciatdb.rel_dim_comment_user_person_like (
dim_comment_user_id,
dim_usuarios_id,
dim_usuarios_comment_like
)
VALUES (
?,
?,
?
)
`

const updateCommentXCoursesLikeSQL = `
UPDATE franquiciatdb.rel_dim_comment_user_person_like
SET dim_usuarios_comment_like = ?
WHERE dim_comment_user_id = ? AND dim_usuarios_id = ? 
`

const updateCommentXAdd = `
UPDATE franquiciatdb.dim_comment_user 
SET dim_comment_nro_like = COALESCE(dim_comment_nro_like, 0) + 1 
WHERE dim_comment_user_id = ?;
`
const updateCommentXRemove = `
UPDATE franquiciatdb.dim_comment_user 
SET dim_comment_nro_like = COALESCE(dim_comment_nro_like, 0) - 1 
WHERE dim_comment_user_id = ?;
`

const setRatingXUser = `
INSERT INTO franquiciatdb.rel_dim_productos_cursos_rating (
dim_productos_id,
dim_usuarios_id,
rel_productos_cursos_rating,
rel_productos_cursos_rating_comment
)
VALUES (
?,
?,
?,
?
)
`

const setCoursesProductNew = `
INSERT INTO franquiciatdb.dim_productos (
dim_productos_nombre,
dim_productos_descripcion
)
VALUES (
?,
?
)
`

const setCoursesPrecioNew = `
INSERT INTO franquiciatdb.dim_precios (
dim_precios_bruto,
dim_precios_version,
dim_precios_neto,
dim_precios_iva
)
VALUES (
?,
?,
?,
?
)
`

const setCoursesRelPrecioNew = `
INSERT INTO franquiciatdb.rel_productos_precios (
dim_productos_id,
dim_precios_id
)
VALUES (
?,
?
)
`

const setCoursesRelCategorioNew = `
INSERT INTO franquiciatdb.rel_productos_categorias (
dim_productos_id,
dim_categorias_id
)
VALUES (
?,
?
)
`

const setCoursesProductos_cursosNew = `
INSERT INTO franquiciatdb.dim_productos_cursos (
dim_productos_cursos_what_you_will_learn,
dim_productos_cursos_requirements,
dim_productos_cursos_who_is_this_course_for,
dim_productos_cursos_this_course_includes
)
VALUES (
?,
?,
?,
?
)
`

const setCoursesRelProductos_cursosNew = `
INSERT INTO franquiciatdb.rel_productos_cursos (
dim_productos_id,
dim_productos_cursos_id
)
VALUES (
?,
?
)
`

const setCoursesUrlPrevieAndImgwNew = `
INSERT INTO franquiciatdb.dim_urls (
dim_urls_url,
dim_urls_tipo
)
VALUES (
?,
?
)
`

const setCoursesRelUrlPreviewNew = `
INSERT INTO franquiciatdb.rel_urls_productos (
    dim_urls_id,
    dim_productos_id
)
VALUES (
?,
?
)
`

const setCoursesRelProductoTypeNew = `
INSERT INTO franquiciatdb.rel_productos_tipos (
    dim_productos_id,
    dim_tipos_id
)
VALUES (
?,
?
)
`

const setCoursesContenNew = `
INSERT INTO franquiciatdb.dim_productos_content (
    dim_productos_content_name,
    dim_productos_content_total_clases,
    dim_productos_content_total_tiempo
)
VALUES (
?,
?,
?
)
`

const setCoursesContenDetailNew = `
INSERT INTO franquiciatdb.dim_productos_content_detaill (
    dim_productos_content_detaill_name,
    dim_productos_content_detaill_total_tiempo
)
VALUES (
?,
?
)
`

const setCoursesRelContenDetailNew = `
INSERT INTO franquiciatdb.rel_dim_productos_content_detaill (
    dim_productos_content_detaill_id,
    dim_productos_content_id
)
VALUES (
?,
?
)
`

const setCoursesRelContenDetailCoursesNew = `
INSERT INTO franquiciatdb.rel_productos_productos_content (
    dim_productos_id,
    dim_productos_content_id
)
VALUES (
?,
?
)
`


const setCoursesRelURLContenDetailCoursesNew = `
INSERT INTO franquiciatdb.rel_url_productos_content_detail (
    dim_productos_content_detaill_id,
    dim_urls_id
)
VALUES (
?,
?
)
`



const setCoursesExam = `
INSERT INTO franquiciatdb.dim_exam (
    dim_exam_desc,
    dim_exam_type
)
VALUES (
?,
?
)
`
const setCoursesExam_preguntas = `
INSERT INTO franquiciatdb.dim_preguntas_exam (
    dim_preguntas_exam_pregunta,
    dim_preguntas_type
)
VALUES (
?,
?
)
`
const setCoursesExam_opciones = `
INSERT INTO franquiciatdb.dim_opciones_exam (
    dim_opciones_exam_valor,
    dim_preguntas_exam_correct
)
VALUES (
?,
?
)
`
const setCoursesRelExam_courses = `
INSERT INTO franquiciatdb.rel_courses_exam (
    dim_productos_id,
    dim_exam_id
)
VALUES (
?,
?
)
`
const setCoursesRelExam_preguntas = `
INSERT INTO franquiciatdb.rel_exam_preguntas (
    dim_exam_id,
    dim_preguntas_exam_id
)
VALUES (
?,
?
)
`
const setCoursesRelPreguntas_opciones = `
INSERT INTO franquiciatdb.rel_preguntas_opciones (
    dim_preguntas_exam_id,
    dim_opciones_exam_id
)
VALUES (
?,
?
)
`

const getCoursesExamPreguntas = `
SELECT
A.idProducto,
A.dim_exam_id,
A.dim_preguntas_exam_pregunta,
A.dim_preguntas_type,
A.dim_opciones_exam_valor,
A.dim_preguntas_exam_correct,
A.dim_preguntas_exam_id as idPregunta
FROM (
SELECT
coursesexam.dim_productos_id AS idProducto,
ex.dim_exam_id,
pexa.dim_preguntas_exam_pregunta,
pexa.dim_preguntas_type,
opx.dim_opciones_exam_valor,
opx.dim_preguntas_exam_correct,
rpx.dim_preguntas_exam_id
FROM franquiciatdb.rel_courses_exam coursesexam
INNER JOIN franquiciatdb.dim_exam ex ON (ex.dim_exam_id = coursesexam.dim_exam_id)
INNER JOIN franquiciatdb.dim_productos pr ON (pr.dim_productos_id = coursesexam.dim_productos_id)
INNER JOIN franquiciatdb.rel_exam_preguntas rpx ON (rpx.dim_exam_id = coursesexam.dim_exam_id)
INNER JOIN franquiciatdb.dim_preguntas_exam pexa ON (pexa.dim_preguntas_exam_id = rpx.dim_preguntas_exam_id)
left JOIN franquiciatdb.rel_preguntas_opciones ropx ON (ropx.dim_preguntas_exam_id = rpx.dim_preguntas_exam_id)
left JOIN franquiciatdb.dim_opciones_exam opx ON (opx.dim_opciones_exam_id = ropx.dim_opciones_exam_id )
) AS A
WHERE A.idProducto = ?
group by A.dim_opciones_exam_valor,
         A.dim_preguntas_type,
         A.dim_preguntas_exam_pregunta;;
`


const setNewUsuarioExamen = `
INSERT INTO franquiciatdb.rel_examen_usuario (
    dim_exam_id,
    dim_usuarios_id
)
VALUES (
?,
?
)
`

const setUpdateActiveCourse = `
UPDATE franquiciatdb.dim_productos
SET dim_productos_activo = ?
WHERE dim_productos_id = ?;
`

const getAprobadosPorCursoYUsuario = `
SELECT
reu.dim_exam_id as examId,
reu.dim_aprobados as aprobado,
reu.dim_numero_intentos as intentosNum
FROM franquiciatdb.rel_examen_usuario reu
WHERE reu.dim_exam_id = ? and reu.dim_usuarios_id = ?
`

const updateAprobado = `
UPDATE franquiciatdb.rel_examen_usuario
SET dim_aprobados = ?
WHERE dim_exam_id = ? and dim_usuarios_id = ?
`

module.exports = { 
    getAllCoursesSQL,
    getAllCoursesWithActiveSQL,
    setUpdateActiveCourse,
    getCoursesPorCategoriasSQL,
    getCategoriesCoursesSQL,
    getCoursesContentHeaderSQL,
    getCoursesContentHeaderWithUserSQL,
    setViewedXUser,
    setUser_Viewed,
    getCommentXCoursesSQL,
    setCommentXCoursesSonSQL,


    setCommentXCoursesSQL,
    setCommentXCoursesRel_UserSQL,
    setCommentXCoursesRel_ProductSQL,
    setCommentXCoursesLikeSQL,
    getCommentXCoursesLikeSQL,
    updateCommentXCoursesLikeSQL,

    updateCommentXAdd,
    updateCommentXRemove,

    setRatingXUser,

    setCoursesProductNew,
    setCoursesPrecioNew,
    setCoursesRelPrecioNew,
    setCoursesRelCategorioNew,
    setCoursesProductos_cursosNew,
    setCoursesRelProductos_cursosNew,
    setCoursesUrlPrevieAndImgwNew,
    setCoursesRelUrlPreviewNew,
    setCoursesRelProductoTypeNew,
    setCoursesContenNew,
    setCoursesContenDetailNew,
    setCoursesRelContenDetailNew,
    setCoursesRelContenDetailCoursesNew,
    setCoursesRelURLContenDetailCoursesNew,
    

    setCoursesExam,
    setCoursesExam_preguntas,
    setCoursesExam_opciones,
    setCoursesRelExam_courses,
    setCoursesRelExam_preguntas,
    setCoursesRelPreguntas_opciones,
    getCoursesExamPreguntas,
    setNewUsuarioExamen,
    getAprobadosPorCursoYUsuario,
    updateAprobado,
    getOneCourseSQL,
    getCursoCompradoSQL,
    getComentarioSQL
} 
