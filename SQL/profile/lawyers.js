const getFavoriteLawyersByIdSQL = `
SELECT 

A.dim_abogados_id AS idAbogado,
A.dim_abogados_destacado AS destacado,
df.dim_favoritos_id AS favorito,
A.dim_abogados_nombres AS nombres,
A.dim_abogados_apellidos AS apellidos,
servicios.service AS precios,
du.dim_urls_url AS avatar,
review.rating AS rating,
review.cantOpiniones AS cantOpiniones,
(
SELECT 
GROUP_CONCAT(DISTINCT deax.dim_especialidades_abogados_nombre ORDER BY deax.dim_especialidades_abogados_id ASC SEPARATOR ', ')
FROM franquiciatdb.rel_especialidades_abogados reax
INNER JOIN franquiciatdb.dim_especialidades_abogados deax ON reax.dim_especialidades_abogados_id = deax.dim_especialidades_abogados_id 
WHERE reax.dim_abogados_id = A.dim_abogados_id 
GROUP BY reax.dim_abogados_id) AS specialty,
(
SELECT
drx.dim_review_text
FROM franquiciatdb.dim_review drx
WHERE drx.dim_abogados_id =A.dim_abogados_id 
ORDER BY drx.dim_review_id DESC LIMIT 1) AS lastReview

FROM franquiciatdb.dim_abogados AS A 
INNER JOIN franquiciatdb.rel_especialidades_abogados rea ON (a.dim_abogados_id = rea.dim_abogados_id)
INNER JOIN franquiciatdb.dim_especialidades_abogados dea ON (rea.dim_especialidades_abogados_id = dea.dim_especialidades_abogados_id)
INNER JOIN franquiciatdb.dim_urls du ON (A.dim_abogados_imagenperfil = du.dim_urls_id)
LEFT JOIN franquiciatdb.dim_favoritos df ON (A.dim_abogados_id = df.dim_abogados_id AND df.dim_favoritos_activo = 1)
LEFT JOIN (
SELECT
dr.dim_abogados_id AS abog_id,
AVG(dr.dim_review_rating) AS rating,
count(dr.dim_review_rating) AS cantOpiniones
FROM franquiciatdb.dim_review dr
GROUP BY dr.dim_abogados_id
) AS review ON (A.dim_abogados_id = review.abog_id)
LEFT JOIN (
SELECT
ds.dim_servicios_abogado_id AS abog_id,
GROUP_CONCAT(DISTINCT CONCAT(ds.dim_servicios_nombre, '##', dp.dim_precios_neto) ORDER BY ds.dim_servicios_abogado_id ASC SEPARATOR '###') AS service
FROM franquiciatdb.dim_servicios ds
INNER JOIN franquiciatdb.dim_precios dp ON (ds.dim_servicios_precios_id = dp.dim_precios_id)
GROUP BY ds.dim_servicios_abogado_id
) AS servicios ON (A.dim_abogados_id = servicios.abog_id)

WHERE df.dim_usuarios_id = ?

GROUP BY A.dim_abogados_id, A.dim_abogados_nombres, A.dim_abogados_apellidos
ORDER BY A.dim_abogados_destacado DESC, df.dim_favoritos_id DESC
`
const getLawyerIdByUserIdSQL = `
SELECT 
    da.dim_abogados_id AS idAbogado 
FROM 
    franquiciatdb.dim_abogados da 
WHERE 
    da.dim_usuarios_id = ?;
`

module.exports = {
    getFavoriteLawyersByIdSQL,
    getLawyerIdByUserIdSQL,
}