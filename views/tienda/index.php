<div class="row justify-content-center p-3">
    <div class="col-lg-12">
        <!-- Información del Cliente -->
        <div class="card custom-card shadow-lg mb-4" style="border-radius: 10px; border: 1px solid #28a745;">
            <div class="card-body p-3">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h4 class="text-success mb-0">TIENDA</h4>
                        <p class="mb-0">Cliente: <span id="nombreCliente" class="fw-bold text-primary"></span></p>
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="btn btn-info me-2" id="btnVerFacturas">
                            <i class="bi bi-receipt"></i> Ver Facturas
                        </button>
                        <button class="btn btn-primary" id="btnVerCarrito">
                            <i class="bi bi-cart3"></i> Ver Carrito (<span id="contadorCarrito">0</span>)
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Catálogo de Productos -->
        <div class="card custom-card shadow-lg" style="border-radius: 10px; border: 1px solid #007bff;">
            <div class="card-body p-3">
                <h3 class="text-center mb-4">CATÁLOGO DE PRODUCTOS</h3>

                <div class="row" id="catalogoProductos">
                    <!-- Los productos se cargarán aquí dinámicamente -->
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal del Carrito -->
<div class="modal fade" id="modalCarrito" tabindex="-1" aria-labelledby="modalCarritoLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalCarritoLabel">
                    <i class="bi bi-cart3"></i> Mi Carrito de Compras
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="carritoItems">
                    <!-- Items del carrito se cargarán aquí -->
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-6">
                        <h5>Total: <span id="totalCarrito" class="text-success">Q 0.00</span></h5>
                    </div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-danger me-2" id="btnVaciarCarrito">
                            <i class="bi bi-trash"></i> Vaciar Carrito
                        </button>
                        <button class="btn btn-success" id="btnFinalizarCompra">
                            <i class="bi bi-check-circle"></i> Finalizar Compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Facturas -->
<div class="modal fade" id="modalFacturas" tabindex="-1" aria-labelledby="modalFacturasLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalFacturasLabel">
                    <i class="bi bi-receipt"></i> Historial de Facturas
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="listaFacturas">
                    <!-- Las facturas se cargarán aquí -->
                </div>
            </div>
        </div>
    </div>
</div>

<script src="<?= asset('build/js/tienda/index.js') ?>"></script>