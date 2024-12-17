DROP TABLE IF EXISTS franquiciatdb.dim_productos;
CREATE TABLE franquiciatdb.dim_sub_productos (
  `dim_productos_id` int NOT NULL AUTO_INCREMENT,
  `dim_precios_id` int DEFAULT NULL,
  `dim_productos_activo` tinyint DEFAULT '1',
  `dim_productos_nombre` varchar(100) NOT NULL,
  `dim_productos_descripcion` text,
  `dim_productos_fechacreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dim_productos_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS franquiciatdb.dim_sub_productos;
CREATE TABLE franquiciatdb.dim_sub_productos
    (
        dim_sub_productos_id INT NOT NULL AUTO_INCREMENT,
		dim_sub_precios_id int DEFAULT NULL,
        dim_sub_productos_activo TINYINT DEFAULT 1,
        dim_sub_productos_nombre VARCHAR(100) NOT NULL,
        dim_sub_productos_descripcion TEXT,
        dim_sub_productos_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_sub_productos_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.rel_subp_productos;
CREATE TABLE franquiciatdb.rel_subp_productos
    (
        dim_productos_id INT NOT NULL,
        dim_sub_productos_id INT NOT NULL,
        rel_activo TINYINT DEFAULT 1,
        rel_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_productos_id, dim_sub_productos_id),
		FOREIGN KEY (dim_productos_id) REFERENCES franquiciatdb.dim_productos(dim_productos_id),
        FOREIGN KEY (dim_sub_productos_id) REFERENCES franquiciatdb.dim_sub_productos(dim_sub_productos_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.rel_sub_productos_precios;
CREATE TABLE franquiciatdb.rel_sub_productos_precios
    (
        dim_sub_productos_id INT NOT NULL,
        dim_precios_id INT NOT NULL,
        rel_activo TINYINT DEFAULT 1,
        rel_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_sub_productos_id, dim_precios_id),
		FOREIGN KEY (dim_sub_productos_id) REFERENCES franquiciatdb.dim_sub_productos(dim_sub_productos_id),
        FOREIGN KEY (dim_precios_id) REFERENCES franquiciatdb.dim_precios(dim_precios_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.dim_beneficios;
CREATE TABLE franquiciatdb.dim_beneficios
    (
        dim_beneficios_id INT NOT NULL AUTO_INCREMENT,
        dim_beneficioss_activo TINYINT DEFAULT 1,
        dim_beneficios_nombre VARCHAR(100) NOT NULL,
        dim_beneficios_descripcion VARCHAR(255),
        dim_beneficios_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_beneficios_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.rel_productos_beneficios;
CREATE TABLE franquiciatdb.rel_productos_beneficios
    (
        dim_productos_id INT NOT NULL,
        dim_beneficios_id INT NOT NULL,
        rel_activo TINYINT DEFAULT 1,
        rel_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_productos_id, dim_beneficios_id),
        FOREIGN KEY (dim_productos_id) REFERENCES franquiciatdb.dim_productos(dim_productos_id),
        FOREIGN KEY (dim_beneficios_id) REFERENCES franquiciatdb.dim_beneficios(dim_beneficios_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.dim_fundamentos;
CREATE TABLE franquiciatdb.dim_fundamentos
    (
        dim_fundamentos_id INT NOT NULL AUTO_INCREMENT,
        dim_fundamentos_activo TINYINT DEFAULT 1,
        dim_fundamentos_nombre VARCHAR(100) NOT NULL,
        dim_fundamentos_descripcion VARCHAR(255),
        dim_fundamentos_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_fundamentos_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.rel_productos_fundamentos;
CREATE TABLE franquiciatdb.rel_productos_fundamentos
    (
        dim_productos_id INT NOT NULL,
        dim_fundamentos_id INT NOT NULL,
        rel_activo TINYINT DEFAULT 1,
        rel_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_productos_id, dim_fundamentos_id),
		FOREIGN KEY (dim_productos_id) REFERENCES franquiciatdb.dim_productos(dim_productos_id),
        FOREIGN KEY (dim_fundamentos_id) REFERENCES franquiciatdb.dim_fundamentos(dim_fundamentos_id)
        
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
