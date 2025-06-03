<?php
require_once __DIR__ . '/../includes/app.php';


use MVC\Router;
use Controllers\AppController;
use Controllers\ClienteController;
use Controllers\ProductoController;
use Controllers\TiendaController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class, 'index']);

// Rutas de Clientes
$router->get('/clientes', [ClienteController::class, 'index']);
$router->post('/clientes/guardarAPI', [ClienteController::class, 'guardarAPI']);
$router->get('/clientes/buscarAPI', [ClienteController::class, 'buscarAPI']);
$router->post('/clientes/modificarAPI', [ClienteController::class, 'modificarAPI']);
$router->get('/clientes/eliminar', [ClienteController::class, 'EliminarAPI']);


// Rutas de Productos
$router->get('/productos', [ProductoController::class, 'index']);
$router->post('/productos/guardarAPI', [ProductoController::class, 'guardarAPI']);
$router->get('/productos/buscarAPI', [ProductoController::class, 'buscarAPI']);
$router->post('/productos/modificarAPI', [ProductoController::class, 'modificarAPI']);
$router->get('/productos/eliminar', [ProductoController::class, 'EliminarAPI']);

// RUTAS DE TIENDA
$router->get('/tienda', [TiendaController::class, 'index']);
$router->get('/tienda/obtenerEnJS', [TiendaController::class, 'buscarAPI']);
$router->post('/tienda/finalizarCompra', [TiendaController::class, 'finalizarCompra']);
$router->get('/tienda/obtenerFacturas', [TiendaController::class, 'obtenerFacturas']);
$router->get('/tienda/obtenerDetalleFactura', [TiendaController::class, 'obtenerDetalleFactura']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
