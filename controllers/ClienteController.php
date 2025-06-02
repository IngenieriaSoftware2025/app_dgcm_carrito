<?php

namespace Controllers;

use Exception;
use Model\Clientes;
use MVC\Router;
use Model\ActiveRecord;

class ClienteController extends ActiveRecord
{
    public static function index(Router $router)
    {
        $clientes = Clientes::all();
        $router->render('clientes/index', [
            'clientes' => $clientes
        ]);
    }

    public static function guardarAPI()
    {
        getHeadersApi();

        // echo json_encode($_POST);
        // return;

        $_POST['cliente_nombres'] = htmlspecialchars($_POST['cliente_nombres']);

        $cantidad_nombres = strlen($_POST['cliente_nombres']);
        if ($cantidad_nombres < 3) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El nombre del cliente debe tener al menos 3 caracteres'
            ]);
            return;
        }

        $_POST['cliente_apellidos'] = htmlspecialchars($_POST['cliente_apellidos']);

        $cantidad_apellidos = strlen($_POST['cliente_apellidos']);
        if ($cantidad_apellidos < 3) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El apellido del cliente debe tener al menos 3 caracteres'
            ]);
            return;
        }

        $_POST['cliente_nit'] = filter_var($_POST['cliente_nit'], FILTER_SANITIZE_NUMBER_INT);

        $_POST['cliente_telefono'] = filter_var($_POST['cliente_telefono'], FILTER_SANITIZE_NUMBER_INT);
        if (strlen($_POST['cliente_telefono']) != 8) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mennsaje' => 'La cantidad de digitos de telefono debe de ser igual a 8'
            ]);
            return;
        }

        $_POST['cliente_correo'] = filter_var($_POST['cliente_correo'], FILTER_SANITIZE_EMAIL);
        if (!filter_var($_POST['cliente_correo'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'El correo electrónico no es válido'
            ]);
            return;
        }
        // Convierte fecha en formato texto a timestamp: 
        // $timestamp = strtotime("2023-12-25 15:30:00");
        // echo $timestamp; // Ejemplo: 1703522200
        $_POST['cliente_fecha'] = date('Y-m-d H:i:s', strtotime($_POST['cliente_fecha']));

        try {
            $cliente = new Clientes([
                'cliente_nombres' => $_POST['cliente_nombres'],
                'cliente_apellidos' => $_POST['cliente_apellidos'],
                'cliente_nit' => $_POST['cliente_nit'],
                'cliente_telefono' => $_POST['cliente_telefono'],
                'cliente_correo' => $_POST['cliente_correo'],
                'cliente_fecha' => $_POST['cliente_fecha'],
                'cliente_situacion' => 1
            ]);


            $crear = $cliente->crear();

            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Cliente guardado correctamente',
                'cliente' => $cliente
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al guardar el cliente: ',
                'detalle' => $e->getMessage()
            ]);
        }
    }

    public static function buscarAPI()
    {
        try {
            $sql = "SELECT * FROM clientes where cliente_situacion = 1";
            $clientes = self::fetchArray($sql);

            if (count($clientes) > 0) {
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Clientes encontrados',
                    'clientes' => $clientes
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'No se encontraron clientes',
                    'detalle' => 'No hay clientes registrados en la base de datos'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al buscar los clientes',
                'detalle' => $e->getMessage()
            ]);
        }
    }

    public static function modificarAPI()
    {

        getHeadersApi();

        $id = $_POST['cliente_id'];

        $_POST['cliente_nombres'] = htmlspecialchars($_POST['cliente_nombres']);

        $cantidad_nombres = strlen($_POST['cliente_nombres']);


        if ($cantidad_nombres < 2) {

            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mennsaje' => 'La cantidad de digitos que debe de contener el nombre debe de ser mayor a dos'
            ]);
            return;
        }


        $_POST['cliente_apellidos'] = htmlspecialchars($_POST['cliente_apellidos']);

        $cantidad_apellidos = strlen($_POST['cliente_apellidos']);

        if ($cantidad_apellidos < 2) {

            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'La cantidad de digitos que debe de contener el apellido debe de ser mayor a dos'
            ]);
            return;
        }

        $_POST['cliente_telefono'] = filter_var($_POST['cliente_telefono'], FILTER_VALIDATE_INT);

        if (strlen($_POST['cliente_telefono']) != 8) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mennsaje' => 'La cantidad de digitos de telefono debe de ser igual a 8'
            ]);
            return;
        }

        $_POST['cliente_nit'] = filter_var($_POST['cliente_nit'], FILTER_SANITIZE_NUMBER_INT);
        $_POST['cliente_correo'] = filter_var($_POST['cliente_correo'], FILTER_SANITIZE_EMAIL);
        $_POST['cliente_fecha'] = date('Y-m-d H:i:s', strtotime($_POST['cliente_fecha']));

        if (!filter_var($_POST['cliente_correo'], FILTER_SANITIZE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'codigo' => 0,
                'mennsaje' => 'El correo electronico ingresado es invalido'
            ]);
            return;
        }

            try {


                $data = Usuarios::find($id);
                // $data->sincronizar($_POST);
                $data->sincronizar([
                    'cliente_nombres' => $_POST['cliente_nombres'],
                    'cliente_apellidos' => $_POST['cliente_apellidos'],
                    'cliente_nit' => $_POST['cliente_nit'],
                    'cliente_telefono' => $_POST['cliente_telefono'],
                    'cliente_correo' => $_POST['cliente_correo'],
                    'cliente_fecha' => $_POST['cliente_fecha'],
                    'cliente_situacion' => 1
                ]);
                $data->actualizar();

                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'La informacion del cliente ha sido modificada exitosamente'
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
    }
