<?php 
require_once __DIR__ . '/../includes/app.php';


use MVC\Router;
use Controllers\AppController;
use Controllers\ClienteController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class,'index']);

// Rutas de Clientes
$router->get('/clientes', [ClienteController::class, 'index']);
$router->post('/clientes/guardarAPI', [ClienteController::class, 'guardarAPI']);
$router->get('/clientes/buscarAPI', [ClienteController::class, 'buscarAPI']);
$router->post('/clientes/modificarAPI', [ClienteController::class, 'modificarAPI']);
$router->get('/clientes/eliminar', [ClienteController::class, 'EliminarAPI']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
