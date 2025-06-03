<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\Facturas;
use Model\ActiveRecord;

class TiendaController extends ActiveRecord
{
    public static function index(Router $router)
    {
        $router->render('tienda/index', []);
    }

    public static function buscarAPI()
    {
        getHeadersApi();

        try {
            $consultaParaBuscar = "SELECT *, producto_id as idProductoJs FROM productos WHERE producto_situacion = 1 ORDER BY producto_cantidad";
            $productoBuscar =  self::fetchArray($consultaParaBuscar); // Realiza la consulta a la base de datos
            if (!$productoBuscar) {
                throw new Exception('No se encontraron productos disponibles');
            }
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Exito al obtener Productos',
                'data' => $productoBuscar // Manda al js con los datos obtenidos
            ]);
            return;
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener Productos',
                'detalle' => $e->getMessage()
            ]);
        }
    }
    public static function finalizarCompra()
    {
        getHeadersApi();

        try {
            // Validar datos requeridos
            if (!isset($_POST['cliente_id']) || !isset($_POST['productos']) || !isset($_POST['total'])) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Datos incompletos para procesar la compra'
                ]);
                return;
            }

            $cliente_id = filter_var($_POST['cliente_id'], FILTER_VALIDATE_INT);
            $productos = json_decode($_POST['productos'], true);
            $total = filter_var($_POST['total'], FILTER_VALIDATE_FLOAT);

            if (!$cliente_id || empty($productos) || !$total) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Datos inválidos'
                ]);
                return;
            }

            // Validar stock antes de procesar
            foreach ($productos as $producto) {
                $sqlStock = "SELECT producto_cantidad FROM productos WHERE producto_id = {$producto['producto_id']}";
                $stockActual = self::fetchArray($sqlStock);

                if (empty($stockActual) || $stockActual[0]['producto_cantidad'] < $producto['cantidad']) {
                    http_response_code(400);
                    echo json_encode([
                        'codigo' => 0,
                        'mensaje' => "Stock insuficiente para el producto ID: {$producto['producto_id']}"
                    ]);
                    return;
                }
            }

            // Crear factura con detalles
            $factura = new Facturas([
                'cliente_id' => $cliente_id,
                'total' => $total,
                'situacion' => 1
            ]);

            $resultado = $factura->crearConDetalle($productos);

            if ($resultado['resultado']) {
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => $resultado['mensaje'],
                    'factura_id' => $resultado['factura_id']
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => $resultado['mensaje']
                ]);
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al procesar la compra',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function obtenerFacturas()
    {
        getHeadersApi();

        try {
            $cliente_id = $_GET['cliente_id'] ?? null;
            $facturas = Facturas::obtenerFacturasConDetalle($cliente_id);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Facturas obtenidas correctamente',
                'data' => $facturas
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener facturas',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function obtenerDetalleFactura()
    {
        getHeadersApi();

        try {
            $factura_id = $_GET['id'] ?? null;

            if (!$factura_id) {
                http_response_code(400);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'ID de factura requerido'
                ]);
                return;
            }

            // Obtener datos de la factura
            $resultado = Facturas::obtenerFacturaConDetalle($factura_id);

            if (!$resultado) {
                http_response_code(404);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Factura no encontrada'
                ]);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Detalle obtenido correctamente',
                'data' => $resultado
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener detalle de factura',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
}
