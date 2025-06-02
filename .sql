create database carbajal_tienda_mvc;

CREATE TABLE clientes (
    cliente_id SERIAL PRIMARY KEY,
    cliente_nombres VARCHAR(255),
    cliente_apellidos VARCHAR(255),
    cliente_nit INT,
    cliente_telefono INT,
    cliente_correo VARCHAR(100),
    cliente_fecha DATETIME YEAR TO SECOND DEFAULT CURRENT YEAR TO SECOND,
    cliente_situacion SMALLINT DEFAULT 1
);

SELECT *FROM clientes;