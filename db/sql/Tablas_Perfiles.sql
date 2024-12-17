DROP TABLE IF EXISTS franquiciatdb.dim_usuarios;
CREATE TABLE franquiciatdb.dim_usuarios
    (
        dim_usuarios_id INT NOT NULL AUTO_INCREMENT,
        dim_usuarios_activo TINYINT DEFAULT 1,
        dim_roles_id INT,        
        dim_usuarios_usuario VARCHAR(100),
        dim_usuarios_correo VARCHAR(100),
        dim_usuarios_key VARCHAR(100),
        dim_urls_id INT NOT NULL DEFAULT 0,
        dim_usuarios_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_usuarios_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS franquiciatdb.dim_usuarios_detalles;
CREATE TABLE franquiciatdb.dim_usuarios_detalles
    (
        dim_usuarios_detalles_id INT NOT NULL AUTO_INCREMENT,
        dim_usuarios_id INT NOT NULL,
        dim_usuarios_detalles_activo TINYINT DEFAULT 1,
        dim_usuarios_detalles_nombres VARCHAR(100),
        dim_usuarios_detalles_apellidos VARCHAR(100),
        dim_usuarios_detalles_usuario VARCHAR(100),
        dim_usuarios_detalles_correo VARCHAR(65),
        dim_usuarios_detalles_fechanacimiento VARCHAR(12),
        dim_usuarios_detalles_telefono VARCHAR(15),
        dim_usuarios_detalles_provincia VARCHAR(32),
        dim_usuarios_detalles_ciudad VARCHAR(32),
        dim_usuarios_detalles_direccion VARCHAR(255),
        dim_usuarios_detalles_codigopostal VARCHAR(10),
        dim_usuarios_detalles_fechacreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dim_usuarios_detalles_id)
    )
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
