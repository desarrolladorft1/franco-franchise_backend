const getLawyerSpecialtiesSQL = `
SELECT 
dea.dim_especialidades_abogados_id AS idSpecialty,
dea.dim_especialidades_abogados_nombre AS specialtyName 
FROM franquiciatdb.dim_especialidades_abogados AS dea
WHERE LOWER(dim_especialidades_abogados_nombre) LIKE LOWER(CONCAT('%', ?, '%'))
`

const setLawyerImageUrlSQL = `
INSERT INTO franquiciatdb.dim_urls (
dim_urls_url
) VALUES ?
`
const setLawyerInfoSQL = `
INSERT INTO franquiciatdb.dim_abogados (
dim_usuarios_id,
dim_abogados_licencia,
dim_abogados_nombres,
dim_abogados_apellidos,
dim_abogados_cedula,
dim_abogados_usuario,
dim_abogados_correo,
dim_abogados_fechanacimiento,
dim_abogados_telefono,
dim_abogados_estado,
dim_abogados_ciudad,
dim_abogados_direccion,
dim_abogados_codigopostal,
dim_abogados_imagenperfil,
dim_abogados_descripcion
) VALUES ?
`

const setLawyerSpecialtiesSQL = `
INSERT INTO franquiciatdb.rel_especialidades_abogados (
dim_abogados_id,
dim_especialidades_abogados_id
) VALUES ?
`

const setLawyerExperienceSQL = `
INSERT INTO franquiciatdb.dim_experiencias (
dim_abogados_id,
dim_experiencias_descripcion
) VALUES ?
`

const setLawyerTrainingSQL = `
INSERT INTO franquiciatdb.dim_formacion (
dim_abogados_id,
dim_formacion_descripcion
) VALUES ?
`

const setLawyerSevicePriceSQL = `
INSERT INTO franquiciatdb.dim_precios (
dim_precios_version,
dim_precios_bruto,
dim_precios_neto,
dim_precios_iva
) VALUES (
1,
?,
?,
?
)
`

const setLawyerServiceSQL = `
INSERT INTO franquiciatdb.dim_servicios (
dim_servicios_nombre,
dim_servicios_abogado_id,
dim_servicios_precios_id
) VALUES (
'Cita en linea',
?,
?
)
`

const getLawyersByFilterSQL = `
CALL franquiciatdb.filter_lawyers(?, ?, ?, ?, ?)
`

const createFavoriteLawyerSQL = `
INSERT INTO franquiciatdb.dim_favoritos (
dim_abogados_id, 
dim_usuarios_id
)
VALUES (
?,
?
)
`

const deleteFavoriteLawyerSQL = `
DELETE FROM franquiciatdb.dim_favoritos 
WHERE dim_abogados_id IN (?) 
AND dim_usuarios_id IN (?)
`

const getLawyerScheduleByIdSQL = `
WITH RECURSIVE Date_Ranges AS (
    SELECT current_date() AS Date
    UNION ALL
    SELECT Date + INTERVAL 1 DAY
    FROM Date_Ranges
    WHERE Date < current_date() + INTERVAL ? DAY),
 Horarios_Abogados AS (
     SELECT
     	 dhc.dim_horarios_citas_id AS horaCitaId
         ,drhd.dim_rangos_horarios_fecha AS fecha
         ,dh.dim_horas_hora AS hora
         ,dhc.dim_horarios_citas_cantidad_agendada AS agendada
         ,dhc.dim_horarios_citas_cantidad_disponible AS disponible
     FROM franquiciatdb.dim_rangos_horarios drh
     INNER JOIN franquiciatdb.dim_rangos_horarios_detalles drhd ON drh.dim_rangos_horarios_id = drhd.dim_rangos_horarios_id
     INNER JOIN franquiciatdb.dim_horarios_citas dhc ON drhd.dim_rangos_horarios_detalles_id = dhc.dim_rangos_horarios_detalles_id
     INNER JOIN franquiciatdb.dim_horas dh ON dhc.dim_horas_id = dh.dim_horas_id
     WHERE
         drh.dim_abogados_id = ?
         AND current_date() <= drh.dim_rangos_horarios_hasta
         AND drh.dim_rangos_horarios_activo
         AND drhd.dim_rangos_horarios_detalles_activo
         AND dhc.dim_horarios_citas_activo
     ORDER BY
         drhd.dim_rangos_horarios_fecha ASC
         ,dh.dim_horas_orden ASC
 )
 SELECT
     dr.date AS fecha
     ,GROUP_CONCAT(
         CONCAT(COALESCE(Horarios_Abogados.horaCitaId, '-'), '##',
                COALESCE(Horarios_Abogados.hora, '-'),'##',
                COALESCE(Horarios_Abogados.agendada, '-'),'##',
                COALESCE(Horarios_Abogados.disponible, '-'))
         ORDER BY dhx.dim_horas_orden ASC SEPARATOR '###') AS agendaDia
 FROM Date_Ranges dr
 INNER JOIN franquiciatdb.dim_horas dhx ON 1=1
 LEFT JOIN Horarios_Abogados ON dr.Date = Horarios_Abogados.fecha AND dhx.dim_horas_hora = Horarios_Abogados.hora
 WHERE dhx.dim_horas_activo 
 GROUP BY dr.date
 ORDER BY dr.date ASC
`

const getLawyerByIdSQL = `
SELECT 

A.dim_abogados_id AS idAbogado,
COALESCE(favoritos.favoritos_id, -1) AS favorito,
A.dim_abogados_licencia AS licencia,
A.dim_abogados_cedula AS cedula,
A.dim_abogados_nombres AS nombres,
A.dim_abogados_apellidos AS apellidos,
(SELECT GROUP_CONCAT(DISTINCT deax.dim_especialidades_abogados_nombre ORDER BY deax.dim_especialidades_abogados_id ASC SEPARATOR ', ')
FROM franquiciatdb.rel_especialidades_abogados reax
INNER JOIN franquiciatdb.dim_especialidades_abogados deax ON (reax.dim_especialidades_abogados_id = deax.dim_especialidades_abogados_id)
WHERE reax.dim_abogados_id = A.dim_abogados_id 
GROUP BY reax.dim_abogados_id) AS specialty,
COALESCE(servicios.service, 'Sin Servicio##0##0') AS precios,
du.dim_urls_url AS avatar,
COALESCE(review.rating, '0') AS rating,
COALESCE(review.cantOpiniones, '0') AS cantOpiniones,
COALESCE(A.dim_abogados_descripcion,'') AS descripcion,
COALESCE(GROUP_CONCAT(DISTINCT form.dim_formacion_descripcion ORDER BY form.dim_formacion_id ASC SEPARATOR '||'),'') AS formacion,
COALESCE(GROUP_CONCAT(DISTINCT exp.dim_experiencias_descripcion ORDER BY exp.dim_experiencias_id ASC SEPARATOR '||'),'') AS experiencias

FROM franquiciatdb.dim_abogados AS A 
INNER JOIN franquiciatdb.rel_especialidades_abogados rea ON (a.dim_abogados_id = rea.dim_abogados_id)
INNER JOIN franquiciatdb.dim_especialidades_abogados dea ON (rea.dim_especialidades_abogados_id = dea.dim_especialidades_abogados_id)
INNER JOIN franquiciatdb.dim_urls du ON (A.dim_abogados_imagenperfil = du.dim_urls_id)
LEFT JOIN franquiciatdb.dim_formacion form ON (A.dim_abogados_id = form.dim_abogados_id)
LEFT JOIN franquiciatdb.dim_experiencias exp ON (A.dim_abogados_id = exp.dim_abogados_id)
LEFT JOIN (
SELECT 
dr.dim_abogados_id AS abog_id,
AVG(dr.dim_review_rating) AS rating,
COUNT(dr.dim_review_rating) AS cantOpiniones
FROM franquiciatdb.dim_review dr
GROUP BY dr.dim_abogados_id
) AS review ON (A.dim_abogados_id = review.abog_id)
LEFT JOIN (
SELECT
ds.dim_servicios_abogado_id AS abog_id,
GROUP_CONCAT(DISTINCT CONCAT(ds.dim_servicios_nombre, '##', dp.dim_precios_neto, '##', ds.dim_servicios_id) ORDER BY ds.dim_servicios_abogado_id ASC SEPARATOR '###') AS service
FROM franquiciatdb.dim_servicios ds
INNER JOIN franquiciatdb.dim_precios dp ON (ds.dim_servicios_precios_id = dp.dim_precios_id)
GROUP BY ds.dim_servicios_abogado_id
) AS servicios ON (A.dim_abogados_id = servicios.abog_id)
LEFT JOIN (
SELECT
df.dim_favoritos_id AS favoritos_id,
df.dim_abogados_id AS abogado_id
FROM franquiciatdb.dim_favoritos df
WHERE df.dim_abogados_id
AND df.dim_usuarios_id = ?
AND df.dim_favoritos_activo
) AS favoritos ON (A.dim_abogados_id = favoritos.abogado_id)
WHERE A.dim_abogados_id = ?
GROUP BY
A.dim_abogados_id, 
A.dim_abogados_nombres, 
A.dim_abogados_apellidos
`

module.exports = { 
    getLawyerSpecialtiesSQL,
    setLawyerImageUrlSQL,
    setLawyerInfoSQL,
    setLawyerSpecialtiesSQL,
    setLawyerExperienceSQL,
    setLawyerTrainingSQL,
    setLawyerSevicePriceSQL,
    setLawyerServiceSQL,
    getLawyersByFilterSQL,
    createFavoriteLawyerSQL,
    deleteFavoriteLawyerSQL,
    getLawyerScheduleByIdSQL,
    getLawyerByIdSQL,
} 
