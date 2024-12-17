const getPurchasedServicesByUserSQL = `
SELECT                                                                          
                                                                                
trx.trx_transacciones_tipo AS tipo,                                             
CASE WHEN arch.trx_archivos_id IS NULL THEN 0 ELSE 1 END AS archivo,            
prod.dim_productos_nombre AS producto_nombre,                                   
CONCAT(abog.dim_abogados_nombres,' ', abog.dim_abogados_apellidos) AS abogado_responsable,	
trxd.trx_transaccionesdetalles_estatus AS producto_estatus                      
                                                                                
                                                                                
FROM franquiciatdb.trx_transacciones trx                                        
INNER JOIN franquiciatdb.trx_transaccionesdetalles trxd ON (trx.trx_transacciones_id = trxd.trx_transacciones_id)
INNER JOIN franquiciatdb.dim_productos prod ON (trxd.dim_productos_id = prod.dim_productos_id)
INNER JOIN franquiciatdb.dim_usuarios usua ON (trx.dim_usuarios_id = usua.dim_usuarios_id)
INNER JOIN franquiciatdb.dim_abogados abog ON (trx.dim_abogados_id = abog.dim_abogados_id)
                                                                                
                                                                                
INNER JOIN franquiciatdb.rel_productos_tipos rpt ON (prod.dim_productos_id = rpt.dim_productos_id)
INNER JOIN franquiciatdb.dim_tipos tip ON (rpt.dim_tipos_id = tip.dim_tipos_id) 
                                                                                
LEFT JOIN franquiciatdb.trx_archivos arch ON (trxd.trx_transaccionesdetalles_id) 
                                                                                
                                                                                
WHERE usua.dim_usuarios_id = ? and tip.dim_tipos_id != 3
`

module.exports = {
    getPurchasedServicesByUserSQL
}