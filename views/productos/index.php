<div class="row justify-content-center p-3">
    <div class="col-lg-10">
        <div class="card custom-card shadow-lg" style="border-radius: 10px; border: 1px solid #007bff;">
            <div class="card-body p-3">
                <div class="row mb-3">
                    <h5 class="text-center mb-2">¡Bienvenido a la Aplicación para el registro, modificación y eliminación de productos!</h5>
                    <h4 class="text-center mb-2 text-primary">MANIPULACIÓN DE PRODUCTOS</h4>
                </div>

                <div class="row justify-content-center p-5 shadow-lg">

                    <form id="FormProductos">
                        <input type="hidden" id="producto_id" name="producto_id">

                        <div class="row mb-3 justify-content-center">
                            <div class="col-lg-6">
                                <label for="producto_nombre" class="form-label">NOMBRE DEL PRODUCTO</label>
                                <input type="text" class="form-control" id="producto_nombre" name="producto_nombre" placeholder="Ingrese el nombre del producto">
                            </div>
                            <div class="col-lg-6">
                                <label for="producto_descripcion" class="form-label">DESCRIPCIÓN DEL PRODUCTO</label>
                                <input type="text" class="form-control" id="producto_descripcion" name="producto_descripcion" placeholder="Ingrese la descripcion del producto">
                            </div>
                        </div>

                        <div class="row mb-3 justify-content-center">
                            <div class="col-lg-6">
                                <label for="producto_precio" class="form-label">PRECIO DEL PRODUCTO</label>
                                <input type="number" step="0.01" min="0.01" class="form-control" id="producto_precio" name="producto_precio" placeholder="Ingrese el precio del producto">
                            </div>
                            <div class="col-lg-6">
                                <label for="producto_cantidad" class="form-label">CANTIDAD EN INVENTARIO</label>
                                <input type="number" min="0" class="form-control" id="producto_cantidad" name="producto_cantidad" placeholder="Ingrese la cantidad disponible">
                            </div>
                        </div>

                        <div class="row justify-content-center mt-5">
                            <div class="col-auto">
                                <button class="btn btn-success" type="submit" id="BtnGuardar">
                                    Guardar
                                </button>
                            </div>

                            <div class="col-auto ">
                                <button class="btn btn-warning d-none" type="button" id="BtnModificar">
                                    Modificar
                                </button>
                            </div>

                            <div class="col-auto">
                                <button class="btn btn-secondary" type="reset" id="BtnLimpiar">
                                    Limpiar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row justify-content-center p-3">
    <div class="col-lg-10">
        <div class="card custom-card shadow-lg" style="border-radius: 10px; border: 1px solid #007bff;">
            <div class="card-body p-3">
                <h3 class="text-center">PRODUCTOS REGISTRADOS EN LA BASE DE DATOS</h3>

                <div class="table-responsive p-2">
                    <table class="table table-striped table-hover table-bordered w-100 table-sm" id="TableProductos">
                    </table>
                </div>

            </div>
        </div>
    </div>
</div>
</div>
<script src="<?= asset('build/js/productos/index.js') ?>"></script>