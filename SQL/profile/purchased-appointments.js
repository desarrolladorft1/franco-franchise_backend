const getPurchasedAppointmentsByUserSQL = `
SELECT

dc.dim_citas_id AS idCita,
dec2.dim_estado_citas_nombre AS estado,
dec2.dim_estado_citas_abreviacion AS abreviacion_estado,
dc.dim_abogados_id AS idAbogado,
dh.dim_horas_id,
dh.dim_horas_hora AS hora,
drhd.dim_rangos_horarios_detalles_id,
drhd.dim_rangos_horarios_fecha AS fechaCita,
a.dim_abogados_nombres AS nombres,
a.dim_abogados_apellidos AS apellidos,
ds.dim_servicios_nombre AS servicioNombre,
ds.dim_servicios_descripcion AS servicioDescripcion,
dp.dim_precios_bruto AS servicioPrecioBruto,
dp.dim_precios_neto AS servicioPrecioNeto,
dp.dim_precios_iva AS servicioPrecioIva,
du.dim_urls_url AS avatar,
GROUP_CONCAT(DISTINCT dea.dim_especialidades_abogados_nombre ORDER BY dea.dim_especialidades_abogados_id ASC SEPARATOR ', ') AS specialty,
dc.dim_citas_reschedule_user_counter as reScheduledCounter
    
FROM franquiciatdb.dim_citas dc
INNER JOIN franquiciatdb.dim_estado_citas dec2 ON (dc.dim_citas_estado_id = dec2.dim_estado_citas_id)
INNER JOIN franquiciatdb.dim_abogados a ON (dc.dim_abogados_id = a.dim_abogados_id)
INNER JOIN franquiciatdb.rel_especialidades_abogados rea ON (a.dim_abogados_id = rea.dim_abogados_id)
INNER JOIN franquiciatdb.dim_especialidades_abogados dea ON (rea.dim_especialidades_abogados_id = dea.dim_especialidades_abogados_id)
INNER JOIN franquiciatdb.dim_urls du ON (a.dim_abogados_imagenperfil = du.dim_urls_id)
INNER JOIN franquiciatdb.dim_horarios_citas dhc ON (dc.dim_horarios_citas_id  = dhc.dim_horarios_citas_id)
INNER JOIN franquiciatdb.dim_horas dh ON (dhc.dim_horas_id = dh.dim_horas_id)
INNER JOIN franquiciatdb.dim_rangos_horarios_detalles drhd ON (dhc.dim_rangos_horarios_detalles_id = drhd.dim_rangos_horarios_detalles_id)
INNER JOIN franquiciatdb.dim_servicios ds ON (dc.dim_servicios_id = ds.dim_servicios_id)
INNER JOIN franquiciatdb.dim_precios dp ON (ds.dim_servicios_precios_id = dp.dim_precios_id)

WHERE dc.dim_usuarios_id = ?
AND dc.dim_citas_activo
AND dec2.dim_estado_citas_abreviacion IN ('A', 'RA', 'S')
AND dec2.dim_estado_citas_activo

GROUP BY 
dc.dim_citas_id ,
a.dim_abogados_id, 
a.dim_abogados_nombres, 
a.dim_abogados_apellidos, 
ds.dim_servicios_nombre,
ds.dim_servicios_descripcion
`

const getCompletedAppointmentsByUserSQL = `
SELECT

dc.dim_citas_id AS idCita,
dec2.dim_estado_citas_nombre AS estado,
dec2.dim_estado_citas_abreviacion AS abreviacion_estado,
dc.dim_abogados_id AS idAbogado,
dh.dim_horas_id,
dh.dim_horas_hora AS hora,
drhd.dim_rangos_horarios_detalles_id,
drhd.dim_rangos_horarios_fecha AS fechaCita,
a.dim_abogados_nombres AS nombres,
a.dim_abogados_apellidos AS apellidos,
ds.dim_servicios_nombre AS servicioNombre,
ds.dim_servicios_descripcion AS servicioDescripcion,
dp.dim_precios_bruto AS servicioPrecioBruto,
dp.dim_precios_neto AS servicioPrecioNeto,
dp.dim_precios_iva AS servicioPrecioIva,
du.dim_urls_url AS avatar,
GROUP_CONCAT(DISTINCT dea.dim_especialidades_abogados_nombre ORDER BY dea.dim_especialidades_abogados_id ASC SEPARATOR ', ') AS specialty,
dc.dim_citas_reschedule_user_counter as reScheduledCounter
    
FROM franquiciatdb.dim_citas dc
INNER JOIN franquiciatdb.dim_estado_citas dec2 ON (dc.dim_citas_estado_id = dec2.dim_estado_citas_id)
INNER JOIN franquiciatdb.dim_abogados a ON (dc.dim_abogados_id = a.dim_abogados_id)
INNER JOIN franquiciatdb.rel_especialidades_abogados rea ON (a.dim_abogados_id = rea.dim_abogados_id)
INNER JOIN franquiciatdb.dim_especialidades_abogados dea ON (rea.dim_especialidades_abogados_id = dea.dim_especialidades_abogados_id)
INNER JOIN franquiciatdb.dim_urls du ON (a.dim_abogados_imagenperfil = du.dim_urls_id)
INNER JOIN franquiciatdb.dim_horarios_citas dhc ON (dc.dim_horarios_citas_id  = dhc.dim_horarios_citas_id)
INNER JOIN franquiciatdb.dim_horas dh ON (dhc.dim_horas_id = dh.dim_horas_id)
INNER JOIN franquiciatdb.dim_rangos_horarios_detalles drhd ON (dhc.dim_rangos_horarios_detalles_id = drhd.dim_rangos_horarios_detalles_id)
INNER JOIN franquiciatdb.dim_servicios ds ON (dc.dim_servicios_id = ds.dim_servicios_id)
INNER JOIN franquiciatdb.dim_precios dp ON (ds.dim_servicios_precios_id = dp.dim_precios_id)

WHERE dc.dim_usuarios_id = ?
AND dc.dim_citas_activo
AND dec2.dim_estado_citas_abreviacion IN ('F')
AND dec2.dim_estado_citas_activo

GROUP BY 
dc.dim_citas_id ,
a.dim_abogados_id, 
a.dim_abogados_nombres, 
a.dim_abogados_apellidos, 
ds.dim_servicios_nombre,
ds.dim_servicios_descripcion
`

const getCanceledAppointmentsByUserSQL = `
SELECT

dc.dim_citas_id AS idCita,
dec2.dim_estado_citas_nombre AS estado,
dec2.dim_estado_citas_abreviacion AS abreviacion_estado,
dc.dim_abogados_id AS idAbogado,
dh.dim_horas_id,
dh.dim_horas_hora AS hora,
drhd.dim_rangos_horarios_detalles_id,
drhd.dim_rangos_horarios_fecha AS fechaCita,
a.dim_abogados_nombres AS nombres,
a.dim_abogados_apellidos AS apellidos,
ds.dim_servicios_nombre AS servicioNombre,
ds.dim_servicios_descripcion AS servicioDescripcion,
dp.dim_precios_bruto AS servicioPrecioBruto,
dp.dim_precios_neto AS servicioPrecioNeto,
dp.dim_precios_iva AS servicioPrecioIva,
du.dim_urls_url AS avatar,
GROUP_CONCAT(DISTINCT dea.dim_especialidades_abogados_nombre ORDER BY dea.dim_especialidades_abogados_id ASC SEPARATOR ', ') AS specialty,
dc.dim_citas_reschedule_user_counter as reScheduledCounter
    
FROM franquiciatdb.dim_citas dc
INNER JOIN franquiciatdb.dim_estado_citas dec2 ON (dc.dim_citas_estado_id = dec2.dim_estado_citas_id)
INNER JOIN franquiciatdb.dim_abogados a ON (dc.dim_abogados_id = a.dim_abogados_id)
INNER JOIN franquiciatdb.rel_especialidades_abogados rea ON (a.dim_abogados_id = rea.dim_abogados_id)
INNER JOIN franquiciatdb.dim_especialidades_abogados dea ON (rea.dim_especialidades_abogados_id = dea.dim_especialidades_abogados_id)
INNER JOIN franquiciatdb.dim_urls du ON (a.dim_abogados_imagenperfil = du.dim_urls_id)
INNER JOIN franquiciatdb.dim_horarios_citas dhc ON (dc.dim_horarios_citas_id  = dhc.dim_horarios_citas_id)
INNER JOIN franquiciatdb.dim_horas dh ON (dhc.dim_horas_id = dh.dim_horas_id)
INNER JOIN franquiciatdb.dim_rangos_horarios_detalles drhd ON (dhc.dim_rangos_horarios_detalles_id = drhd.dim_rangos_horarios_detalles_id)
INNER JOIN franquiciatdb.dim_servicios ds ON (dc.dim_servicios_id = ds.dim_servicios_id)
INNER JOIN franquiciatdb.dim_precios dp ON (ds.dim_servicios_precios_id = dp.dim_precios_id)

WHERE dc.dim_usuarios_id = ?
AND dc.dim_citas_activo
AND dec2.dim_estado_citas_abreviacion IN ('R')
AND dec2.dim_estado_citas_activo

GROUP BY 
dc.dim_citas_id ,
a.dim_abogados_id, 
a.dim_abogados_nombres, 
a.dim_abogados_apellidos, 
ds.dim_servicios_nombre,
ds.dim_servicios_descripcion
`

module.exports = {
    getPurchasedAppointmentsByUserSQL,
    getCompletedAppointmentsByUserSQL,
    getCanceledAppointmentsByUserSQL
}