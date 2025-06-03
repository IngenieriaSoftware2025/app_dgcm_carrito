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

CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    producto_nombre VARCHAR(150),
    producto_descripcion VARCHAR(255),
    producto_precio DECIMAL(10, 2),
    producto_cantidad INT NOT NULL,
    producto_situacion SMALLINT DEFAULT 1
);

SELECT * FROM productos;


INSERT INTO productos (producto_nombre, producto_descripcion, producto_precio, producto_cantidad)
VALUES("Tractor", "Granja", 3000, 5);

INSERT INTO productos (producto_nombre, producto_descripcion, producto_precio, producto_cantidad)
VALUES("Laptop", "Oficina", 3000, 3);

INSERT INTO productos (producto_nombre, producto_descripcion, producto_precio, producto_cantidad)
VALUES("Pala", "Ingeniero", 3000, 8);

SELECT * FROM productos

CREATE TABLE facturas (
    factura_id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    fecha_emision DATETIME YEAR TO SECOND DEFAULT CURRENT YEAR TO SECOND,
    total DECIMAL(12,2),
    situacion SMALLINT DEFAULT 1 
);

ALTER TABLE facturas 
    ADD CONSTRAINT FOREIGN KEY (cliente_id) 
    REFERENCES clientes CONSTRAINT fk_facturas_clientes;
    
CREATE TABLE detalle_facturas (
    detalle_id SERIAL PRIMARY KEY,
    factura_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario  DECIMAL(10,2)
);

ALTER TABLE detalle_facturas 
    ADD CONSTRAINT FOREIGN KEY (factura_id) 
    REFERENCES facturas CONSTRAINT fk_facturas_detalles;
    
ALTER TABLE detalle_facturas 
    ADD CONSTRAINT FOREIGN KEY (producto_id) 
    REFERENCES productos CONSTRAINT fk_detalles_fac_productos; 