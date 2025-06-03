import Swal from "sweetalert2";
import { Modal } from "bootstrap";

let clienteSeleccionado = null;
let productosArray = [];
let carritoArray = [];

const nombreCliente = document.getElementById('nombreCliente');
const catalogoProductos = document.getElementById('productos_a_listar_en_tienda_js');
const btnVerCarrito = document.getElementById('btnVerCarrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const modalCarrito = new Modal(document.getElementById('modalCarrito'));
const carritoItems = document.getElementById('carritoItems');
const totalCarrito = document.getElementById('totalCarrito');
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
const btnVerFacturas = document.getElementById('btnVerFacturas');
const modalFacturas = new Modal(document.getElementById('modalFacturas'));
const listaFacturas = document.getElementById('listaFacturas');

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
    cargaCarritoGuardado();
}

const cargarProductos = async () => {
    try {
        const url = '/app_dgcm_carrito/tienda/obtenerEnJS';
        const respuesta = await fetch(url);
        const datos = await respuesta.json(); //Aqui llega PHP

        if (datos.codigo === 1) {
            productosArray = datos.data; // data trae de PHP los productos
            muestraProductos();
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

const muestraProductos = () => {
    catalogoProductos.innerHTML = '';

    // Recorre con el array local los productos que trajo de la API
    productosArray.forEach(productoBuscar => {
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
                                    id = "cantidad_${productoBuscar.idProductoJs}"
                                    min = "1"
                                    max = "${productoBuscar.producto_cantidad}"
                                    value = "1"
                                >
                                <button class = "btn btn-success agregar-carrito"
                                    data-id = "${productoBuscar.idProductoJs}">
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
        catalogoProductos.innerHTML += productoMuestra;
    });

    // Eventos para agregar al carrito
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', mandaloAlCarrito);
    });
};

const mandaloAlCarrito = (event) => {
    const proId = parseInt(event.currentTarget.dataset.id);
    const cantidadEntrada = document.getElementById(`cantidad_${proId}`);
    const cantidad = parseInt(cantidadEntrada.value);

    const pro = productoBuscar.find(p => p.idProductoJs == proId);

    if (!pro) {
        Swal.fire({
            icon: 'error',
            title: 'Algo paso en el carrito',
            text: 'Producto no encontrado'
        });
        return;
    }

    if (cantidad <= 0 || cantidad > productoBuscar.producto_cantidad) {
        Swal.fire({
            icon: 'warning',
            title: 'Algo paso en validar cantidad',
            text: 'Quieres mas de lo que hay'
        });
    }

    // Veamos si el producto esta en el carrito
    const itemYa = carritoArray.find(item => item.idProductoJs == proId);

    if (itemYa) {
        const cantNueva = itemYa.cantidad + cantidad;
        if (cantNueva > productoBuscar.producto_cantidad) {
            Swal.fire({
                icon: 'warning',
                title: 'No hay tantos',
                text: `Solo hay ${productoBuscar.producto_cantidad - itemYa.cantidad} unidades`
            });
            return;
        }
        itemYa.cantidad = cantNueva;
    } else {
        carritoArray.push({
            idProductoJs: proId,
            nombreProductoJs: productoBuscar.producto_nombre,
            precioProductoJs: parseFloat(productoBuscar.producto_precio),
            cantidadProductoJs: cantidad,
            productoDisponibleJs: productoBuscar.producto_cantidad
        });
    }

    actualizaCarrito();
    cantidadEntrada.value = 1;

    Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        text: ` ${productoBuscar.producto_nombre}`,
        timer: 1500,
        showConfirmButton: false
    });
};

const actualizaCarrito = () => {
    contadorCarrito.textContent = carritoArray.length;
    guardaCarrito();
    muestraCarrito();
}

const muestraCarrito = () => {
    carritoItems.innerHTML = '';
    let total = 0;

    if (carritoArray.length === 0) {
        carritoItems.innerHTML = '<p class = "text-center text-muted">Carrito vacio</p>';
    } else {
        carritoArray.forEach((productoRecorrido, posicion) => {
            const subtotal = productoRecorrido.precioProductoJs * productoRecorrido.cantidadProductoJs;
            total += subtotal;

            carritoItems.innerHTML +=
                `
                <div class = "row align-items-center md-3 p-3 border rounded">
                    <div class = "col-md-4">
                        <strong>
                            ${productoRecorrido.nombreProductoJs}
                        </strong>
                    </div>

                    <div class = "col-md-2">
                        Q ${productoRecorrido.precioProductoJs.toFixed(2)}
                    </div>
                    
                    <div class = "col-md-3">
                        <div class = "input-group">
                            <button class = "btn btn-outline-secondary btn-sm cambiar-cantidad">
                                data-posicion = "${posicion}" data-accion = "restar">
                                -
                            </button>

                            <input type = "number" class = "form-control-sm text-center"
                                value = "${posicion.cantidadProductoJs}"
                                min = "1"
                                max = "${posicion.productoDisponibleJs}"
                                onchange = "cambiarCantidadAqui(${posicion}, this.value)">
                            <button class = "btn btn-outline-secondary btn-sm cambiar-cantidad">
                                data-posicion = "${posicion}" data-accion = "sumar"
                                +
                            </button>
                        </div>
                    </div>
                    <div class = "col-md-2">
                        <strong>Q ${subtotal.toFixed(2)}</strong>
                    </div>
                    <div class = "col-md-1">
                        <button class = "btn btn-danger btn-sm eliminar-posicion" data-posicion = "${posicion}">
                            <i class = "bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `
        });

        // Cambia la cantidad
        document.querySelectorAll('.cambiar-cantidad').forEach(btn => {
            btn.addEventListener('click', cambiarCantidad);
        });

        document.querySelectorAll('.eliminar-posicion').forEach(btn => {
            btn.addEventListener('click', eliminaPosicion)
        });
    }
    totalCarrito.textContent = `Q ${total.toFixed(2)}`;
};


const cambiarCantidad = (event) => {
    const posicion = parseInt(event.currentTarget.dataset.posicion);
    const accion = event.currentTarget.dataset.accion;
    const item = carritoArray[posicion];

    if (accion === 'sumar') {
        if (item.cantidadProductoJs < item.productoDisponibleJs) {
            item.cantidadProductoJs++
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Has pedido mucho',
                text: `solo tenemos ${item.productoDisponibleJs} unidades`,
                timer: 2000
            });
            return;
        }
    } else if (accion === 'restar') {
        if (item.cantidadProductoJs > 1) {
            item.cantidadProductoJs--;
        } else {
            eliminaPosicion(event);
            return;
        }
    }
    actualizaCarrito();
};

window.cambiarCantidadAqui = (posicion, cantNueva) => {
    const cantidad = parseInt(cantNueva);

    const item = carritoArray[posicion];

    if (cantidad <= 0) {
        eliminaPosicionPorIndex(posicion);
    } else if (cantidad > item.productoDisponibleJs) {
        Swal.fire({
            icon: 'warning',
            title: 'Pides mucho',
            text: `Tenemos ${item.productoDisponibleJs} unidades`
        });
        actualizaCarrito();
    } else {
        item.cantidad = cantidad;
        actualizaCarrito();
    }
};

const eliminaPosicion = (event) => {
    const posicion = parseInt(event.currentTarget.dataset.posicion);
    eliminaPosicionPorIndex(posicion);
};

const eliminaPosicionPorIndex = (event) => {
    carritoArray.splice(posicion, 1);
    actualizaCarrito();
};

const vaciaCarrito = () => {
    Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Se eliminarán todos los productos del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, dale',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            actualizaCarrito();
            Swal.fire('Carrito vacio', '', 'success');
        }
    });
};

// Eventos
document.addEventListener('DOMContentLoaded', arrancarTienda);
btnVaciarCarrito.addEventListener('click', vaciaCarrito);
