const setPurchasedAppointmentInStateSQL = `
UPDATE 
franquiciatdb.dim_citas
SET 
dim_citas_estado_id = (
SELECT
dec2.dim_estado_citas_id
FROM franquiciatdb.dim_estado_citas dec2
WHERE
dec2.dim_estado_citas_abreviacion = ?
AND dec2.dim_estado_citas_activo)
WHERE 
dim_citas_id = ?
`
const getDatesLawyerSQL = `
call verificarDisponibilidadCita(?, ?);
`

const increaseAvailabilityByAppointmentIdSQL = `
UPDATE 
franquiciatdb.dim_horarios_citas
SET 
dim_horarios_citas_cantidad_disponible = dim_horarios_citas_cantidad_disponible + 1
WHERE 
dim_horarios_citas_id = (SELECT dc.dim_horarios_citas_id FROM franquiciatdb.dim_citas dc WHERE dc.dim_citas_id = ?)
AND 
dim_horarios_citas_cantidad_disponible < dim_horarios_citas_cantidad_agendada
`

const addNewAppointmentReviewSQL = `
INSERT INTO franquiciatdb.dim_review
(dim_review_rating, dim_review_text, dim_abogados_id, dim_usuarios_id)
VALUES(?, ?, ?, ?)
`

const setAppointmentAsReviewedSQL = `
UPDATE franquiciatdb.dim_citas
SET dim_citas_calificado = 1
WHERE dim_citas_id = ?
`

const getAppointmentStateByAppointmentIdSQL = `
SELECT
	dec2.dim_estado_citas_id AS id
	,dec2.dim_estado_citas_nombre AS nombre
	,dec2.dim_estado_citas_abreviacion AS abreviacion
FROM franquiciatdb.dim_citas dc
INNER JOIN franquiciatdb.dim_estado_citas dec2 ON dc.dim_citas_estado_id = dec2.dim_estado_citas_id
WHERE dim_citas_id = ? AND dec2.dim_estado_citas_activo
`

const updateAppointmenStateSQL = `
UPDATE 
franquiciatdb.dim_citas
SET 
    dim_citas_estado_id = (
    	SELECT
			dec2.dim_estado_citas_id
		FROM franquiciatdb.dim_estado_citas dec2
		WHERE
			dec2.dim_estado_citas_abreviacion = ?
			AND dec2.dim_estado_citas_activo)
WHERE 
    dim_citas_id = ?
`

const increaseReScheduledCounterSQL = `
UPDATE franquiciatdb.dim_citas SET
	dim_citas_reschedule_user_counter = dim_citas_reschedule_user_counter + 1
WHERE
	dim_citas_id = ?
`

const changeAppointmentHourDateSQL = `
UPDATE 
    franquiciatdb.dim_citas
SET 
    dim_horarios_citas_id = ?
WHERE 
    dim_citas_id = ?
`

const decreaseAvailabilitySQL = `
UPDATE 
    franquiciatdb.dim_horarios_citas
SET 
    dim_horarios_citas_cantidad_disponible = dim_horarios_citas_cantidad_disponible-1
WHERE 
    dim_horarios_citas_id = ? 
    AND 
    dim_horarios_citas_cantidad_disponible > 0
`

const getAppointmentDetailsSQL = `
SELECT
cit.dim_citas_id AS idCitas,
cit.dim_citas_evento_id AS idEvento,
cit.dim_citas_estado_id AS idEstado,
con.dim_citas_informacion_contacto_correo AS correoCliente,
CONCAT(con.dim_citas_informacion_contacto_nombres, ' ', con.dim_citas_informacion_contacto_apellidos) AS nombreCliente,
con.dim_citas_informacion_contacto_telefono AS telefonoCliente,
abo.dim_abogados_correo AS correoAbogado,
CONCAT(abo.dim_abogados_nombres, ' ',abo.dim_abogados_apellidos) AS nombreAbogado,
con.dim_citas_informacion_contacto_motivo AS motivo,
GROUP_CONCAT(DISTINCT esp.dim_especialidades_abogados_nombre ORDER BY esp.dim_especialidades_abogados_id ASC SEPARATOR ', ') AS especialidades,
rhd.dim_rangos_horarios_fecha AS fechaCita,
hor.dim_horas_hora AS horaCita
FROM franquiciatdb.dim_citas cit
INNER JOIN franquiciatdb.dim_abogados abo ON (cit.dim_abogados_id = abo.dim_abogados_id)
INNER JOIN franquiciatdb.rel_especialidades_abogados rea ON (abo.dim_abogados_id = rea.dim_abogados_id)
INNER JOIN franquiciatdb.dim_especialidades_abogados esp ON (rea.dim_especialidades_abogados_id = esp.dim_especialidades_abogados_id)
INNER JOIN franquiciatdb.dim_horarios_citas hcit ON (cit.dim_horarios_citas_id = hcit.dim_horarios_citas_id)
INNER JOIN franquiciatdb.dim_rangos_horarios_detalles rhd ON (hcit.dim_rangos_horarios_detalles_id = rhd.dim_rangos_horarios_detalles_id)
INNER JOIN franquiciatdb.dim_horas hor ON (hcit.dim_horas_id = hor.dim_horas_id)
INNER JOIN franquiciatdb.dim_citas_informacion_contacto con ON (cit.dim_citas_id = con.dim_citas_id)
WHERE cit.dim_citas_id = ?
`

const updateAppointmentEventSQL = `
UPDATE franquiciatdb.dim_citas SET
dim_citas_evento_id = ?
WHERE dim_citas_id = ? `


const getAppointmenStateIdByAbbreviationSQL = `
SELECT
	dec2.dim_estado_citas_id AS id
FROM franquiciatdb.dim_estado_citas dec2
WHERE
	dec2.dim_estado_citas_abreviacion = ?
	AND dec2.dim_estado_citas_activo;
`

const setNewAppointmentSQL = `
INSERT INTO franquiciatdb.dim_citas
( 
    dim_citas_activo, 
    dim_horarios_citas_id, 
    dim_abogados_id, 
    dim_usuarios_id, 
    dim_servicios_id, 
    dim_citas_estado_id, 
    dim_usuario_creacion_id, 
    dim_usuario_modificacion_id, 
    dim_citas_fechacreacion, 
    dim_citas_fechamodificacion
)
VALUES(1, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`

const setAppointmentContactInformationSQL = `
INSERT INTO 
franquiciatdb.dim_citas_informacion_contacto
(
    dim_citas_informacion_contacto_activo, 
    dim_citas_id, 
    dim_cliente_id, 
    dim_citas_informacion_contacto_nombres, 
    dim_citas_informacion_contacto_apellidos, 
    dim_citas_informacion_contacto_motivo, 
    dim_citas_informacion_contacto_correo, 
    dim_citas_informacion_contacto_telefono, 
    dim_citas_informacion_contacto_fechacreacion, 
    dim_citas_informacion_contacto_fechamodificacion
)
VALUES(1, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
`

module.exports = { 
    getDatesLawyerSQL,
    setPurchasedAppointmentInStateSQL,
    increaseAvailabilityByAppointmentIdSQL,
    addNewAppointmentReviewSQL,
    setAppointmentAsReviewedSQL,
    getAppointmentStateByAppointmentIdSQL,
    updateAppointmenStateSQL,
    increaseReScheduledCounterSQL,
    changeAppointmentHourDateSQL,
    getAppointmentDetailsSQL,
    updateAppointmentEventSQL,
    decreaseAvailabilitySQL,
    getAppointmenStateIdByAbbreviationSQL,
    setNewAppointmentSQL,
    setAppointmentContactInformationSQL,
} 
