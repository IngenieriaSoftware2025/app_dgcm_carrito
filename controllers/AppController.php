<?php

namespace Controllers;

use MVC\Router;

class AppController {
    public static function index(Router $router){
        $variable = "";
        $router->render('pages/index', []);
    }

}