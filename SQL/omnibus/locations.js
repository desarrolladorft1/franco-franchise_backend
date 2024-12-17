const getStatesSQL = `
SELECT 
est.dim_estados_id AS idEstados,
est.dim_estados_clave AS clave,
est.dim_estados_nombre AS nombre,
est.dim_estados_abreviatura AS abreviatura
FROM franquiciatdb.dim_estados est
`
const getMunicipalitiesSQL = `
SELECT
mun.dim_municipios_id AS idMunicipios,
mun.dim_estados_id AS idEstados,
mun.dim_municipios_clave AS clave,
mun.dim_municipios_nombre AS nombre
FROM franquiciatdb.dim_municipios mun
`

module.exports = {
    getStatesSQL,
    getMunicipalitiesSQL
}