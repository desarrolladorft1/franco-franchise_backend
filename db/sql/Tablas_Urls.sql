DROP TABLE IF EXISTS diezlegaldb.dim_urls;
CREATE TABLE diezlegaldb.dim_urls
    (
        dim_urls_id INT NOT NULL AUTO_INCREMENT,
        dim_urls_activo TINYINT DEFAULT 1,
        dim_urls_url VARCHAR(255) NOT NULL,
        dim_urls_tipo TINYINT DEFAULT 1,
        dim_urls_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_urls_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.rel_urls_productos;
CREATE TABLE franquiciatdb.rel_urls_productos
    (
        dim_urls_id INT NOT NULL,
        dim_productos_id INT NOT NULL,
        rel_activo TINYINT DEFAULT 1,
        rel_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_urls_id, dim_productos_id),
        FOREIGN KEY (dim_productos_id) REFERENCES franquiciatdb.dim_productos(dim_productos_id),
        FOREIGN KEY (dim_urls_id) REFERENCES franquiciatdb.dim_urls(dim_urls_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.rel_urls_sub_productos;
CREATE TABLE franquiciatdb.rel_urls_sub_productos
    (
        dim_urls_id INT NOT NULL,
        dim_sub_productos_id INT NOT NULL,
        rel_activo TINYINT DEFAULT 1,
        rel_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_urls_id, dim_sub_productos_id),
        FOREIGN KEY (dim_sub_productos_id) REFERENCES franquiciatdb.dim_sub_productos(dim_sub_productos_id),
        FOREIGN KEY (dim_urls_id) REFERENCES franquiciatdb.dim_urls(dim_urls_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;