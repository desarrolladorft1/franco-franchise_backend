const setUser = `
INSERT INTO franquiciatdb.dim_usuarios ( 
dim_usuarios_usuario, 
dim_usuarios_correo, 
dim_usuarios_key
)
SELECT  
dim_usuarios_usuario, 
dim_usuarios_correo, 
dim_usuarios_key 
FROM (
SELECT  
? AS dim_usuarios_usuario, 
? AS dim_usuarios_correo,
? AS dim_usuarios_key
) AS tmp
WHERE NOT EXISTS (
SELECT 
dim_usuarios_key 
FROM franquiciatdb.dim_usuarios 
WHERE dim_usuarios_key = ?
) LIMIT 1
`

const setUserDetails = `
INSERT INTO franquiciatdb.dim_usuarios_detalles ( 
dim_usuarios_id, 
dim_usuarios_detalles_usuario,
dim_usuarios_detalles_correo 
)
SELECT  
dim_usuarios_id,
dim_usuarios_detalles_usuario, 
dim_usuarios_detalles_correo
FROM (
SELECT  
? AS dim_usuarios_id, 
? AS dim_usuarios_detalles_usuario,
? AS dim_usuarios_detalles_correo
) AS tmp
WHERE NOT EXISTS (
SELECT 
dim_usuarios_id 
FROM franquiciatdb.dim_usuarios_detalles
WHERE dim_usuarios_id = ?
) LIMIT 1
`

const getUserByKey = `
SELECT
usua.dim_usuarios_id AS idUsuario, 
usua.dim_roles_id AS idRoles,
dud.dim_usuarios_detalles_usuario AS usuario, 
dud.dim_usuarios_detalles_correo AS correo,
dud.dim_usuarios_detalles_nombres AS nombres,
dud.dim_usuarios_detalles_apellidos AS apellidos, 
dud.dim_usuarios_detalles_telefono AS telefono,
dud.dim_usuarios_detalles_fechanacimiento AS fechaNacimiento,
dud.dim_usuarios_detalles_provincia AS provincia,
dud.dim_usuarios_detalles_ciudad AS ciudad,
dud.dim_usuarios_detalles_direccion AS direccion,
dud.dim_usuarios_detalles_codigopostal AS codigoPostal
FROM franquiciatdb.dim_usuarios usua 
INNER JOIN franquiciatdb.dim_usuarios_detalles dud ON (dud.dim_usuarios_id = usua.dim_usuarios_id)
WHERE usua.dim_usuarios_key = ?
`

const editUserDetailSQL = `
UPDATE franquiciatdb.dim_usuarios_detalles 
SET 
dim_usuarios_detalles_nombres = ?,
dim_usuarios_detalles_apellidos = ?,
dim_usuarios_detalles_telefono = ?,
dim_usuarios_detalles_provincia = ?,
dim_usuarios_detalles_ciudad = ?,
dim_usuarios_detalles_direccion = ?,
dim_usuarios_detalles_codigopostal = ?,
dim_usuarios_detalles_fechanacimiento = ?
WHERE dim_usuarios_id = ?;
`

const getNonLawyerUsersSQL = `
SELECT

usu.dim_usuarios_id AS idUsuarios,
usu.dim_usuarios_usuario AS usuario,
usu.dim_usuarios_correo AS correo 

FROM franquiciatdb.dim_usuarios usu
LEFT JOIN franquiciatdb.dim_abogados abg ON (usu.dim_usuarios_id = abg.dim_usuarios_id)

WHERE abg.dim_usuarios_id IS NULL
AND usu.dim_usuarios_correo IS NOT NULL
`

module.exports = {  
    setUser, 
    setUserDetails, 
    getUserByKey,
    editUserDetailSQL,
    getNonLawyerUsersSQL
} 