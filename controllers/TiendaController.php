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

    public static function buscarAPI() {
        getHeadersApi();

        try{
            $consultaParaBuscar = "SELECT * FROM productos WHERE producto_situacion = 1 ORDER BY producto_cantidad";
            $productoBuscar =  self::fetchArray($consultaParaBuscar); // Realiza la consulta a la base de datos
            if(!$productoBuscar){
                throw new Exception('No se encontraron productos disponibles');
            }                                       
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Exito al obtener Productos',
                'data' => $productoBuscar // Manda al js con los datos obtenidos
            ]);
            return;
        }catch(Exception $e){
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener Productos',
                'detalle' => $e->getMessage()
            ]);
        }
        
    }
}
