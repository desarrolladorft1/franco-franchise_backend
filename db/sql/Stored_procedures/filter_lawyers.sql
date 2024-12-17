DELIMITER $$
CREATE PROCEDURE franquiciatdb.filter_lawyers (IN NombresApellidos CHAR(50) , Especialidades CHAR(128), OrderPrice TINYINT(1), OrderRating TINYINT(1), userId INTEGER)
BEGIN
        SELECT
            RESULTS.idAbogado,
            RESULTS.destacado,
            RESULTS.favorito,
            RESULTS.nombres,
            RESULTS.apellidos,
            RESULTS.specialty,
            RESULTS.precios,
            RESULTS.precios_number,
            RESULTS.avatar,
            RESULTS.rating,
            RESULTS.cantOpiniones,
            RESULTS.lastReview
        FROM (
                SELECT 
                    A.dim_abogados_id AS idAbogado
                    ,A.dim_abogados_destacado AS destacado
                    ,COALESCE(favoritos.favoritos_id, -1) AS favorito
                    ,A.dim_abogados_nombres AS nombres
                    ,A.dim_abogados_apellidos AS apellidos
                    ,(SELECT 
                            GROUP_CONCAT(DISTINCT deax.dim_especialidades_abogados_nombre ORDER BY deax.dim_especialidades_abogados_id ASC SEPARATOR ', ')
                        FROM franquiciatdb.rel_especialidades_abogados reax
                        INNER JOIN franquiciatdb.dim_especialidades_abogados deax ON reax.dim_especialidades_abogados_id = deax.dim_especialidades_abogados_id 
                        WHERE
                            reax.dim_abogados_id = A.dim_abogados_id 
                        GROUP BY
                            reax.dim_abogados_id) AS specialty
                    ,servicios.service AS precios
                    ,servicios.service_price AS precios_number
                    ,du.dim_urls_url AS avatar
                    ,COALESCE(review.rating, '0') AS rating
                    ,COALESCE(review.cantOpiniones, '0') AS cantOpiniones
                    ,COALESCE((SELECT
                            drx.dim_review_text
                        FROM franquiciatdb.dim_review drx
                        WHERE drx.dim_abogados_id =A.dim_abogados_id 
                        ORDER BY drx.dim_review_id DESC LIMIT 1), '') AS lastReview
                FROM franquiciatdb.dim_abogados AS A 
                INNER JOIN franquiciatdb.rel_especialidades_abogados rea ON 
                    (a.dim_abogados_id = rea.dim_abogados_id AND
                    ( Especialidades IS NULL OR (Especialidades IS NOT NULL AND rea.dim_especialidades_abogados_id in (select * from json_table( concat('[', Especialidades ,']'), '$[*]' columns (specialtyId int path '$') ) tx))))
                INNER JOIN franquiciatdb.dim_especialidades_abogados dea ON rea.dim_especialidades_abogados_id = dea.dim_especialidades_abogados_id
                INNER JOIN franquiciatdb.dim_urls du ON A.dim_abogados_imagenperfil = du.dim_urls_id
                INNER JOIN (
                    SELECT
                    ds.dim_servicios_abogado_id AS abog_id
                    ,CONCAT(ds.dim_servicios_nombre, '##', dp.dim_precios_neto, '##', ds.dim_servicios_id) AS service
                    ,dp.dim_precios_neto AS service_price
                    FROM franquiciatdb.dim_servicios ds
                    INNER JOIN franquiciatdb.dim_precios dp ON ds.dim_servicios_precios_id = dp.dim_precios_id
                    GROUP BY ds.dim_servicios_abogado_id
                ) AS servicios ON A.dim_abogados_id = servicios.abog_id
                LEFT JOIN (
                    SELECT
                    dr.dim_abogados_id AS abog_id
                    ,AVG(dr.dim_review_rating) AS rating
                    ,count(dr.dim_review_rating) AS cantOpiniones
                    FROM franquiciatdb.dim_review dr
                    GROUP BY dr.dim_abogados_id
                ) AS review ON A.dim_abogados_id = review.abog_id
                LEFT JOIN (
                    SELECT
                        df.dim_favoritos_id AS favoritos_id
                        ,df.dim_abogados_id AS abogado_id
                    FROM franquiciatdb.dim_favoritos df
                    WHERE df.dim_abogados_id
                    AND df.dim_usuarios_id = userId
                    AND df.dim_favoritos_activo
                ) AS favoritos ON A.dim_abogados_id = favoritos.abogado_id
                WHERE
                    A.dim_abogados_activo
                    AND rea.rel_activo
                    AND dea.dim_especialidades_abogados_activo
                    AND du.dim_urls_activo
                GROUP BY
                    A.dim_abogados_id, A.dim_abogados_nombres, A.dim_abogados_apellidos
                ORDER BY A.dim_abogados_destacado DESC, favoritos.favoritos_id DESC
        ) AS RESULTS
       WHERE
        (CASE WHEN NombresApellidos IS NOT NULL THEN
			LOWER(CONCAT(RESULTS.nombres ,' ', RESULTS.apellidos)) LIKE LOWER(CONCAT('%', NombresApellidos, '%'))
        END)
       ORDER BY
		   CASE
				WHEN OrderPrice IS NOT NULL AND OrderPrice = 0 THEN
					RESULTS.precios_number 
		    END DESC,
			CASE
				WHEN OrderPrice IS NOT NULL AND OrderPrice = 1 THEN
					RESULTS.precios_number 
			END ASC,
            
            CASE
                WHEN OrderRating IS NOT NULL AND OrderRating = 0 THEN
                    RESULTS.rating 
            END DESC,
            CASE
                WHEN OrderRating IS NOT NULL AND OrderRating = 1 THEN
                    RESULTS.rating 
            END ASC;
END$$
DELIMITER ;