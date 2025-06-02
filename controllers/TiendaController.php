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
}

