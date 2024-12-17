const setPDF = `
INSERT INTO franquiciatdb.trx_pdf (
dim_clientes_id, 
dim_productos_id,
trx_transaccionesdetalles_id,
trx_pdf_url
)
VALUES (
?,
?,
?,
?
)
`
const getStates = `
SELECT 
est.dim_estados_id AS idEstados,
est.dim_estados_clave AS clave,
est.dim_estados_nombre AS nombre,
est.dim_estados_abreviatura AS abreviatura
FROM franquiciatdb.dim_estados est
`
const getMunicipalities = `
SELECT
mun.dim_municipios_id AS idMunicipios,
mun.dim_estados_id AS idEstados,
mun.dim_municipios_clave AS clave,
mun.dim_municipios_nombre AS nombre
FROM franquiciatdb.dim_municipios mun
`

const getUrlPDF = `
SELECT pdf.trx_pdf_url AS urlPDF FROM franquiciatdb.trx_pdf pdf WHERE pdf.trx_transaccionesdetalles_id = ?
`

const getUrlPDFCompletionById = `
SELECT pdf.trx_pdf_url AS urlPDF FROM franquiciatdb.trx_pdf pdf WHERE pdf.trx_transaccionesdetalles_id = ? AND pdf.trx_pdf_url LIKE '%Completacion%'
`

const getUrlPDFApprovalById = `
SELECT pdf.trx_pdf_url AS urlPDF FROM franquiciatdb.trx_pdf pdf WHERE pdf.trx_transaccionesdetalles_id = ? AND pdf.trx_pdf_url LIKE '%Aprobacion%'
`

module.exports = {
    setPDF,
    getUrlPDF,
    getStates,
    getMunicipalities,
    getUrlPDFCompletionById,
    getUrlPDFApprovalById
}