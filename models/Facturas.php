<?php
namespace Model;

class Facturas extends ActiveRecord
{
    protected static $tabla = 'facturas';
    public static $idTabla = 'factura_id';
    protected static $columnasDB = [
        'cliente_id',
        'total',
        'fecha_emision',
        'situacion'
    ];

    public $factura_id;
    public $cliente_id;
    public $total;
    public $fecha_emision;
    public $situacion;

    public function __construct($args = []) {
        $this->factura_id = $args['factura_id'] ?? null;
        $this->cliente_id = $args['cliente_id'] ?? null;
        $this->total = $args['total'] ?? 0;
        $this->fecha_emision = $args['fecha_emision'] ?? date('Y-m-d H:i:s');
        $this->situacion = $args['situacion'] ?? 1;
    }

    public static function obtenerFacturasConDetalle($cliente_id = null) {
        $where = $cliente_id ? "WHERE f.cliente_id = $cliente_id" : "";
        
        $sql = "SELECT f.*, c.cliente_nombres, c.cliente_apellidos
                FROM facturas f 
                INNER JOIN clientes c ON f.cliente_id = c.cliente_id 
                $where
                ORDER BY f.fecha_emision DESC";
        
        return self::fetchArray($sql);
    }

    public static function obtenerFacturaConDetalle($factura_id) {
        $sqlFactura = "SELECT f.*, c.cliente_nombres, c.cliente_apellidos, c.cliente_nit
                    FROM facturas f 
                    INNER JOIN clientes c ON f.cliente_id = c.cliente_id 
                    WHERE f.factura_id = $factura_id";
        
        $factura = self::fetchArray($sqlFactura);
        
        if (empty($factura)) {
            return null;
        }
        
        $sqlDetalle = "SELECT df.*, p.producto_nombre, p.producto_descripcion
                    FROM detalle_facturas df
                    INNER JOIN productos p ON df.producto_id = p.producto_id
                    WHERE df.factura_id = $factura_id";
        
        $detalle = self::fetchArray($sqlDetalle);
        
        return [
            'factura' => $factura[0],
            'detalle' => $detalle
        ];
    }

    public function crearConDetalle($productos) {
        try {
            $resultado = $this->crear();
            
            if ($resultado['resultado']) {
                $factura_id = $resultado['id'];
                
                foreach ($productos as $producto) {
                    $detalle = new DetalleFacturas([
                        'factura_id' => $factura_id,
                        'producto_id' => $producto['producto_id'],
                        'cantidad' => $producto['cantidad'],
                        'precio_unitario' => $producto['precio']
                    ]);
                    
                    $detalle->crear();
                    
                    // Actualizar cantidad del producto
                    $sqlUpdate = "UPDATE productos 
                                SET producto_cantidad = producto_cantidad - {$producto['cantidad']} 
                                WHERE producto_id = {$producto['producto_id']}";
                    self::SQL($sqlUpdate);
                }
                
                return [
                    'resultado' => true,
                    'mensaje' => 'Factura creada',
                    'factura_id' => $factura_id
                ];
            }
        } catch (Exception $e) {
            return [
                'resultado' => false,
                'mensaje' => 'Error: ' . $e->getMessage()
            ];
        }
    }
}