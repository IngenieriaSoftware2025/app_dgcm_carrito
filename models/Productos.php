<?php

namespace Model;

class Productos extends ActiveRecord
{

    public static $tabla = 'productos';
    public static $columnasDB = [
        'producto_nombre',
        'producto_descripcion',
        'producto_precio',
        'producto_cantidad',
        'producto_situacion'
    ];

    public static $idTabla = 'producto_id';
    public $producto_id;
    public $producto_nombre;
    public $producto_descripcion;
    public $producto_precio;
    public $producto_cantidad;
    public $producto_situacion;

    public function __construct($args = [])
    {
        $this->producto_id = $args['producto_id'] ?? null;
        $this->producto_nombre = $args['producto_nombre'] ?? '';
        $this->producto_descripcion = $args['producto_descripcion'] ?? '';
        $this->producto_precio = $args['producto_precio'] ?? 0;
        $this->producto_cantidad = $args['producto_cantidad'] ?? 0;
        $this->producto_situacion = $args['producto_situacion'] ?? 1;
    }

    public static function EliminarProductos($id)
    {
        // Primero verificar si el producto tiene cantidad
        $sqlVerificar = "SELECT producto_cantidad FROM productos WHERE producto_id = $id";
        $producto = self::fetchArray($sqlVerificar);

        if (empty($producto)) {
            return [
                'resultado' => false,
                'mensaje' => 'El producto no existe'
            ];
        }

        $cantidad = $producto[0]['producto_cantidad'];

        if ($cantidad > 0) {
            return [
                'resultado' => false,
                'mensaje' => 'No se puede eliminar el producto porque tiene existencia en stock (' . $cantidad . ' unidades)'
            ];
        }

        // Si no tiene cantidad, proceder con la eliminación
        $sql = "DELETE FROM productos WHERE producto_id = $id";
        $resultado = self::SQL($sql);

        if ($resultado) {
            return [
                'resultado' => true,
                'mensaje' => 'Producto eliminado correctamente'
            ];
        } else {
            return [
                'resultado' => false,
                'mensaje' => 'Error al eliminar el producto'
            ];
        }
    }

    // public static function EliminarProductoLogico($id)
    // {

    //     $sql = "UPDATE productos SET producto_situacion = 0 WHERE producto_id = $id";

    //     return self::SQL($sql);
    // }

    // public static function ReactivarProducto($id)
    // {

    //     $sql = "UPDATE productos SET producto_situacion = 1 WHERE producto_id = $id";

    //     return self::SQL($sql);
    // }
}
