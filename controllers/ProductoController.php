<?php

namespace Controllers;

use Exception;
use Model\ActiveRecord;
use Model\Productos;
use Mpdf\Tag\P;
use MVC\Router;

class ProductoController extends ActiveRecord
{

    public static function index(Router $router)
    {
        $router->render('productos/index', []);
    }

    public static function guardarAPI()
    {

        getHeadersApi();

        // echo json_encode($_POST);
        // return;

        $_POST['producto_nombre'] = htmlspecialchars($_POST['producto_nombre']);

        $cantidad_nombres = strlen($_POST['producto_nombre']);


        if ($cantidad_nombres < 2) {

            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mennsaje' => 'La cantidad de caracteres que debe de contener el nombre de producto debe de ser mayor a dos'
            ]);
            return;
        }

        $_POST['producto_descripcion'] = htmlspecialchars($_POST['producto_descripcion']);

        $cantidad_descripcion = strlen($_POST['producto_descripcion']);

        if ($cantidad_descripcion < 2) {

            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'La cantidad de caracteres que debe de contener descripcion de producto debe de ser mayor a dos'
            ]);
            return;
        }

        $_POST['producto_precio'] = filter_var($_POST['producto_precio'], FILTER_VALIDATE_FLOAT);

        if (!$_POST['producto_precio'] || $_POST['producto_precio'] <= 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El precio del producto debe ser mayor a 0'
            ]);
            return;
        }

        $_POST['producto_cantidad'] = filter_var($_POST['producto_cantidad'], FILTER_VALIDATE_INT);

        if ($_POST['producto_cantidad'] === false || $_POST['producto_cantidad'] < 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'La cantidad del producto debe ser un número entero mayor o igual a 0'
            ]);
            return;
        }

        try {
            // $data = new productos();

            $data = new Productos([
                'producto_nombre' => $_POST['producto_nombre'],
                'producto_descripcion' => $_POST['producto_descripcion'],
                'producto_cantidad' => $_POST['producto_cantidad'],
                'producto_precio' => $_POST['producto_precio'],
                'producto_situacion' => 1
            ]);

            $crear = $data->crear();

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Exito el producto ha sido registrado correctamente'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al guardar',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function buscarAPI()
    {

        try {

            // $data = productos::all();

            $sql = "SELECT * FROM productos where producto_situacion = 1";
            $data = self::fetchArray($sql);

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'productos obtenidos correctamente',
                'data' => $data
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al obtener los productos',
                'detalle' => $e->getMessage(),
            ]);
        }
    }


    public static function modificarAPI()
    {

        getHeadersApi();

        // echo json_encode($_POST);
        // return;
        $id = $_POST['producto_id'];
        $_POST['producto_nombre'] = htmlspecialchars($_POST['producto_nombre']);

        $cantidad_nombres = strlen($_POST['producto_nombre']);


        if ($cantidad_nombres < 2) {

            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mennsaje' => 'La cantidad de caracteres que debe de contener el nombre de producto debe de ser mayor a dos'
            ]);
            return;
        }

        $_POST['producto_descripcion'] = htmlspecialchars($_POST['producto_descripcion']);

        $cantidad_descripcion = strlen($_POST['producto_descripcion']);

        if ($cantidad_descripcion < 2) {

            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'La cantidad de caracteres que debe de contener descripcion de producto debe de ser mayor a dos'
            ]);
            return;
        }

        $_POST['producto_precio'] = filter_var($_POST['producto_precio'], FILTER_VALIDATE_FLOAT);

        if (!$_POST['producto_precio'] || $_POST['producto_precio'] <= 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El precio del producto debe ser mayor a 0'
            ]);
            return;
        }

        $_POST['producto_cantidad'] = filter_var($_POST['producto_cantidad'], FILTER_VALIDATE_INT);

        if ($_POST['producto_cantidad'] === false || $_POST['producto_cantidad'] < 0) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'La cantidad del producto debe ser un número entero mayor o igual a 0'
            ]);
            return;
        }


        try {


            $data = Productos::find($id);
            // $data->sincronizar($_POST);
            $data->sincronizar([
                'producto_nombre' => $_POST['producto_nombre'],
                'producto_descripcion' => $_POST['producto_descripcion'],
                'producto_cantidad' => $_POST['producto_cantidad'],
                'producto_precio' => $_POST['producto_precio'],
                'producto_situacion' => 1
            ]);
            $data->actualizar();

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'La informacion del producto ha sido modificada exitosamente'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al guardar',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function EliminarAPI()
{
    try {
        $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

        if (!$id) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'ID del producto requerido'
            ]);
            return;
        }

        $resultado = Productos::EliminarProductos($id);

        if ($resultado['resultado']) {
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => $resultado['mensaje']
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'codigo' => 0,
            'mensaje' => 'Error al eliminar',
            'detalle' => $e->getMessage(),
        ]);
    }
}
}
