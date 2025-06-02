<?php
namespace Controllers;

use Exception;
use Model\Clientes;
use MVC\Router;
use Model\ActiveRecord;

class ClienteController extends ActiveRecord {
    public static function index(Router $router) {
        $clientes = Clientes::all();
        $router->render('clientes/index', [
            'clientes' => $clientes
        ]);
    }

    public static function guardarAPI(){
        getHeadersApi();

        echo json_encode($_POST);
        return;
    }
}