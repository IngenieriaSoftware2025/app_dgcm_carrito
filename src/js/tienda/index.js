import Swal from "sweetalert2";
import { Modal } from "bootstrap";

let clienteSeleccionado = null;
let productosEnJsArray = [];

const nombreCliente = document.getElementById('nombreCliente');
const traerProductos = document.getElementById('productos_a_listar_en_tienda_js');

const arrancarTienda = () => {
    // pasamos el usuario
    const dataDelCliente = localStorage.getItem('clienteSeleccionado');
    console.log('Cliente escogido:', dataDelCliente);

    if (!dataDelCliente) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin cliente',
            text: 'Debe seleccionar uno',
            confirmButtonText: 'Ir a clientes'
        }).then(() => {
            window.location.href = '/app_dgcm_carrito/clientes'
        });
        return;
    }

    clienteSeleccionado = JSON.parse(dataDelCliente);
    nombreCliente.textContent = clienteSeleccionado.nombre;

    cargarProductos();
}

const cargarProductos = async () => {
    try {
        const url = '/app_dgcm_carrito/tienda/obtenerEnJS';
        const respuesta = await fetch(url);
        const datos = await respuesta.json(); //Aqui llega PHP

        if (datos.codigo === 1) {
            productosEnJsArray = datos.data; // data trae de PHP los productos
            darLosProductos();
        } else {
            throw new Error(datos.mensaje);
        }
    } catch (error) {
        console.log('Error al cargar productos', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar los productos'
        });
    }
};

const darLosProductos = () => {
    traerProductos.innerHTML = '';

    // Recorre con el array local los productos que trajo de la API
    productosEnJsArray.forEach(productoBuscar => {
        const productoMuestra = `
            <div class = "col-md-4 mb-4">
                <div class = "card h-100 shadow-sm">
                    <div class = "card-body">
                        <h5>
                            ${productoBuscar.producto_nombre}
                        </h5>

                        <p class = "card-text">
                            ${productoBuscar.producto_descripcion}
                        </p>

                        <p class = "card-text">
                            <strong class = "text-success">
                                Q ${parseFloat(productoBuscar.producto_precio).toFixed(2)}
                            </strong>
                        </p>

                        <p class = "card-text">
                            <small class = "text-muted">
                                Disponibles: ${productoBuscar.producto_cantidad} unidades
                            </small>
                        </p>
                    </div>

                    <div class = "card-footer">
                        ${productoBuscar.producto_cantidad > 0 ? 
                        `
                            <div class = "input-group mb-2">
                                <input type = "number"
                                    class = "form-control cantidad-input-js-dar"
                                    id = "cantidad_${productoBuscar.producto_id}"
                                    min = "1"
                                    max = "${productoBuscar.producto_cantidad}"
                                    value = "1"
                                >
                                <button class = "btn btn-success agregar-carrito"
                                    data-id = "${productoBuscar.producto_id}">
                                    <i class = "bi bi-cart-plus"></i> Agregar
                                </button>
                            </div>
                        ` 
                        : 
                        `
                            <button class = "btn btn-secondary" disabled>
                                <i class = "bi bi-x-circle"></i>No disponible
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
        traerProductos.innerHTML += productoMuestra;
    });
};

document.addEventListener('DOMContentLoaded', arrancarTienda);
