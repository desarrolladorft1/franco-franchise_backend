const getAppointmentsByLawyerIdSQL = `
SELECT
    date_format(drhd.dim_rangos_horarios_fecha, '%Y-%m-%d') AS fechaCita
    ,dc.dim_citas_id AS citaId
    ,dec2.dim_estado_citas_abreviacion AS estadoCitaAbrev
    ,dec2.dim_estado_citas_nombre  AS estadoCitaNombre
    ,dc.dim_usuarios_id AS costumerId
    ,dh.dim_horas_hora AS horaCita
    ,dhc.dim_horarios_citas_cantidad_agendada AS agendada
    ,dhc.dim_horarios_citas_cantidad_disponible AS disponible
    ,dcic.dim_citas_informacion_contacto_nombres AS nombres
    ,dcic.dim_citas_informacion_contacto_apellidos AS apellidos
    ,dcic.dim_citas_informacion_contacto_correo AS correo
    ,dcic.dim_citas_informacion_contacto_telefono AS telefono
FROM franquiciatdb.dim_citas dc
INNER JOIN franquiciatdb.dim_estado_citas dec2 ON dc.dim_citas_estado_id = dec2.dim_estado_citas_id
INNER JOIN franquiciatdb.dim_horarios_citas dhc ON dc.dim_horarios_citas_id = dhc.dim_horarios_citas_id
INNER JOIN franquiciatdb.dim_rangos_horarios_detalles drhd ON dhc.dim_rangos_horarios_detalles_id = drhd.dim_rangos_horarios_detalles_id
INNER JOIN franquiciatdb.dim_horas dh ON dhc.dim_horas_id = dh.dim_horas_id
INNER JOIN franquiciatdb.dim_citas_informacion_contacto dcic ON dc.dim_citas_id = dcic.dim_citas_id 
WHERE
    dc.dim_abogados_id = ?
    AND dc.dim_citas_activo
    AND dhc.dim_horarios_citas_activo
    AND drhd.dim_rangos_horarios_detalles_activo
    AND dec2.dim_estado_citas_activo
    AND dh.dim_horas_activo
    AND drhd.dim_rangos_horarios_fecha >= CURRENT_DATE()
    AND dcic.dim_citas_informacion_contacto_activo
`

const getAppointmentsByDatesAndLawyerIdSQL = `
WITH fechas_parametros AS (
    SELECT
        date(?) AS desde
        ,date(?) AS hasta
    FROM DUAL
)
SELECT
    drhd.dim_rangos_horarios_fecha AS fecha
    ,dhc.dim_horarios_citas_id AS horarioCitaId
    ,CASE
        WHEN (dhc.dim_horarios_citas_cantidad_disponible = dhc.dim_horarios_citas_cantidad_agendada)
        THEN TRUE
        ELSE FALSE
    END AS disponible
    ,dh.dim_horas_id AS hora_id
    ,dh.dim_horas_hora AS horaCita
FROM franquiciatdb.dim_rangos_horarios drh
INNER JOIN fechas_parametros ON ((drh.dim_rangos_horarios_desde BETWEEN fechas_parametros.desde AND fechas_parametros.hasta) OR (drh.dim_rangos_horarios_hasta BETWEEN fechas_parametros.desde AND fechas_parametros.hasta))
INNER JOIN franquiciatdb.dim_rangos_horarios_detalles drhd ON 
    drh.dim_rangos_horarios_id = drhd.dim_rangos_horarios_id
INNER JOIN franquiciatdb.dim_horarios_citas dhc ON drhd.dim_rangos_horarios_detalles_id = dhc.dim_rangos_horarios_detalles_id
INNER JOIN franquiciatdb.dim_horas dh ON dhc.dim_horas_id = dh.dim_horas_id
WHERE
    drh.dim_rangos_horarios_activo
    AND drh.dim_abogados_id = ?
    AND drhd.dim_rangos_horarios_fecha BETWEEN fechas_parametros.desde AND fechas_parametros.hasta
    AND drhd.dim_rangos_horarios_detalles_activo
    AND dhc.dim_horarios_citas_activo 
`

const getMissingRangesDateSQL = `
WITH RECURSIVE Date_Ranges AS (
    SELECT
        t.fecha AS fecha
        ,r.dim_rangos_horarios_id
        ,r.dim_abogados_id
    FROM (SELECT date(?) AS fecha) AS t    
    LEFT JOIN (SELECT * FROM franquiciatdb.dim_rangos_horarios drh WHERE drh.dim_abogados_id = ? AND date(?) BETWEEN drh.dim_rangos_horarios_desde AND drh.dim_rangos_horarios_hasta) r
    ON 1=1 
    UNION ALL
    SELECT
        dr.fecha + INTERVAL 1 DAY
        ,drhx.dim_rangos_horarios_id
        ,drhx.dim_abogados_id
    FROM Date_Ranges dr
    LEFT JOIN franquiciatdb.dim_rangos_horarios drhx
    ON ((fecha + INTERVAL 1 DAY BETWEEN drhx.dim_rangos_horarios_desde AND drhx.dim_rangos_horarios_hasta) AND (drhx.dim_abogados_id = ?))
    WHERE fecha < date(?))
SELECT
    *
FROM Date_Ranges dr 
`

const setDateRangeScheduleSQL = `
INSERT INTO 
    franquiciatdb.dim_rangos_horarios
(
    dim_rangos_horarios_activo, 
    dim_abogados_id, 
    dim_rangos_horarios_desde, 
    dim_rangos_horarios_hasta, 
    dim_rangos_horarios_fechacreacion
)
VALUES(1, ?, ?, ?, CURRENT_TIMESTAMP);
`

const getRangeIdAndRangeDetailIdByDateSQL = `
SELECT
drh.dim_rangos_horarios_id AS rango_id
,(    SELECT
        drhd.dim_rangos_horarios_detalles_id
    FROM franquiciatdb.dim_rangos_horarios_detalles drhd
    WHERE
        drhd.dim_rangos_horarios_id = drh.dim_rangos_horarios_id
        AND drhd.dim_rangos_horarios_detalles_activo
        AND drhd.dim_rangos_horarios_fecha = date(?)
) AS rango_detalle_id
FROM franquiciatdb.dim_rangos_horarios drh
WHERE
drh.dim_abogados_id = ?
AND drh.dim_rangos_horarios_activo
AND date(?) BETWEEN drh.dim_rangos_horarios_desde AND drh.dim_rangos_horarios_hasta `

const setAppointmentScheduleSQL = `
INSERT INTO 
    franquiciatdb.dim_horarios_citas
(
    dim_horarios_citas_activo, 
    dim_rangos_horarios_detalles_id, 
    dim_horas_id, 
    dim_horarios_citas_cantidad_agendada, 
    dim_horarios_citas_cantidad_disponible, 
    dim_horarios_citas_fechacreacion
)
VALUES(1, ?, ?, 1, 1, CURRENT_TIMESTAMP);

`

const setDateRangeScheduleDetailsSQL = `
INSERT INTO 
    franquiciatdb.dim_rangos_horarios_detalles
(
    dim_rangos_horarios_detalles_activo, 
    dim_rangos_horarios_id, 
    dim_rangos_horarios_fecha, 
    dim_rangos_horarios_detalles_fechacreacion
)
VALUES(1, ?, ?, CURRENT_TIMESTAMP);
`


const deleteAppointmentScheduledByIdSQL = `
DELETE FROM franquiciatdb.dim_horarios_citas
WHERE dim_horarios_citas_id=? AND dim_horarios_citas_cantidad_disponible=1
`


module.exports = { 
    getAppointmentsByLawyerIdSQL,
    getAppointmentsByDatesAndLawyerIdSQL,
    getMissingRangesDateSQL,
    setDateRangeScheduleSQL,
    getRangeIdAndRangeDetailIdByDateSQL,
    setAppointmentScheduleSQL,
    setDateRangeScheduleDetailsSQL,
    deleteAppointmentScheduledByIdSQL,
} 