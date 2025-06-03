<?php
namespace Model;

class DetalleFacturas extends ActiveRecord
{
    protected static $tabla = 'detalle_facturas';
    public static $idTabla = 'detalle_id';
    protected static $columnasDB = [
        'factura_id',
        'producto_id',
        'cantidad',
        'precio_unitario'
    ];

    public $detalle_id;
    public $factura_id;
    public $producto_id;
    public $cantidad;
    public $precio_unitario;

    public function __construct($args = []) {
        $this->detalle_id = $args['detalle_id'] ?? null;
        $this->factura_id = $args['factura_id'] ?? null;
        $this->producto_id = $args['producto_id'] ?? null;
        $this->cantidad = $args['cantidad'] ?? 0;
        $this->precio_unitario = $args['precio_unitario'] ?? 0;
    }
}