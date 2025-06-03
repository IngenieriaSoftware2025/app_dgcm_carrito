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

const cargaProductos = async () => {
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
        console.log('Producto:', productoBuscar);
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
                                <i class = "bi bi-x-circle"></i> No disponible
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
    console.log('ID buscado:', proId);
    const cantidadEntrada = document.getElementById(`cantidad_${proId}`);
    console.log('Elemento encontrado:', cantidadEntrada);
    const cantidad = parseInt(cantidadEntrada.value);

    const pro = productosArray.find(p => p.producto_id == proId);

    if (!pro) {
        Swal.fire({
            icon: 'error',
            title: 'Algo paso en el carrito',
            text: 'Producto no encontrado'
        });
        return;
    }

    if (cantidad <= 0 || cantidad > pro.producto_cantidad) {
        Swal.fire({
            icon: 'warning',
            title: 'Algo paso en validar cantidad',
            text: 'Quieres mas de lo que hay'
        });
        return;
    }

    // ver si el producto esta en el carrito
    const itemYa = carritoArray.find(item => item.idProductoJs == proId);

    if (itemYa) {
        const cantNueva = itemYa.cantidadProductoJs + cantidad;
        if (cantNueva > pro.producto_cantidad) {
            Swal.fire({
                icon: 'warning',
                title: 'No hay tantos',
                text: `Solo hay ${pro.producto_cantidad - itemYa.cantidadProductoJs} unidades`
            });
            return;
        }
        itemYa.cantidadProductoJs = cantNueva;
    } else {
        carritoArray.push({
            idProductoJs: proId,
            nombreProductoJs: pro.producto_nombre,
            precioProductoJs: parseFloat(pro.producto_precio),
            cantidadProductoJs: cantidad,
            productoDisponibleJs: pro.producto_cantidad
        });
    }

    actualizaCarrito();
    cantidadEntrada.value = 1;

    Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        text: ` ${pro.producto_nombre}`,
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
                            <button class = "btn btn-outline-secondary btn-sm cambiar-cantidad"
                                data-posicion = "${posicion}" 
                                data-accion = "restar">
                                -
                            </button>

                            <input type = "number" 
                                class = "form-control form-control-sm text-center"
                                value = "${productoRecorrido.cantidadProductoJs}"
                                min = "1"
                                max = "${productoRecorrido.productoDisponibleJs}"
                                onchange = "cambiarCantidadAqui(${posicion}, this.value)">
                                
                            <button class = "btn btn-outline-secondary btn-sm cambiar-cantidad"
                                data-posicion = "${posicion}" 
                                data-accion = "sumar">
                                +
                            </button>
                        </div>
                    </div>
                    
                    <div class = "col-md-2">
                        <strong>Q ${subtotal.toFixed(2)}</strong>
                    </div>
                    
                    <div class = "col-md-1">
                        <button class = "btn btn-danger btn-sm eliminar-posicion" 
                            data-posicion = "${posicion}">
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
        item.cantidadProductoJs = cantidad;
        actualizaCarrito();
    }
};

const eliminaPosicion = (event) => {
    const posicion = parseInt(event.currentTarget.dataset.posicion);
    eliminaPosicionPorIndex(posicion);
};

const eliminaPosicionPorIndex = (posicion) => {
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
            carritoArray = [];
            actualizaCarrito();
            Swal.fire('Carrito vacio', '', 'success');
        }
    });
};

const finalizaCompra = async () => {
    if (carritoArray.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Debe agregar al menos un producto al carrito'
        });
        return;
    }

    const total = carritoArray.reduce((sum, item) => sum + (item.precioProductoJs * item.cantidadProductoJs), 0);

    const confirmacion = await Swal.fire({
        title: '¿Finalizar compra?',
        html: `
            <p>Cliente: <strong>${clienteSeleccionado.nombre}</strong></p>
            <p>Total: <strong>Q ${total.toFixed(2)}</strong></p>
            <p>¿Desea proceder con la compra?</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, comprar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {

            const productosParaPHP = carritoArray.map(item => ({
                producto_id: item.idProductoJs,
                cantidad: item.cantidadProductoJs,
                precio: item.precioProductoJs,
                nombre: item.nombreProductoJs
            }));

            const url = '/app_dgcm_carrito/tienda/finalizarCompra';
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    cliente_id: clienteSeleccionado.id,
                    productos: JSON.stringify(productosParaPHP),
                    total: total
                })
            };

            const response = await fetch(url, config);
            const datos = await response.json();

            if (datos.codigo === 1) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Compra realizada!',
                    text: `Factura #${datos.factura_id} generada exitosamente`,
                    timer: 3000
                });

                // Limpia carrito y cerrar modal
                carritoArray = [];
                localStorage.removeItem(`carrito_${clienteSeleccionado.id}`);
                actualizaCarrito();
                modalCarrito.hide();

                // Recargar productos para actualizar stock
                cargaProductos();
            } else {
                throw new Error(datos.mensaje);
            }

        } catch (error) {
            console.error('Error al finalizar compra:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo procesar la compra'
            });
        }
    }
};

const guardaCarrito = () => {
    localStorage.setItem(`carrito_${clienteSeleccionado.id}`, JSON.stringify(carritoArray));
};

const cargaCarritoGuardado = () => {
    const carritoGuardado = localStorage.getItem(`carrito_${clienteSeleccionado.id}`);
    if (carritoGuardado) {
        carritoArray = JSON.parse(carritoGuardado);
        actualizaCarrito();
    }
};

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

    cargaProductos();
    cargaCarritoGuardado();
}

const verFacturas = async () => {
    try {
        const url = `/app_dgcm_carrito/tienda/obtenerFacturas?cliente_id=${clienteSeleccionado.id}`;
        const response = await fetch(url);
        const datos = await response.json();

        if (datos.codigo === 1) {
            mostrarListaFacturas(datos.data);
            modalFacturas.show();
        } else {
            throw new Error(datos.mensaje);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las facturas'
        });
    }
};

const mostrarListaFacturas = (facturas) => {
    listaFacturas.innerHTML = '';

    if (facturas.length === 0) {
        listaFacturas.innerHTML = '<p class="text-center">No hay facturas</p>';
        return;
    }

    facturas.forEach(factura => {
        listaFacturas.innerHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <h5>Factura #${factura.factura_id}</h5>
                    <p>Fecha: ${factura.fecha_emision}</p>
                    <p>Total: Q ${parseFloat(factura.total).toFixed(2)}</p>
                    <button class="btn btn-info" onclick="verDetalle(${factura.factura_id})">
                        Ver Detalle
                    </button>
                </div>
            </div>
        `;
    });
};

const verDetalle = async (facturaId) => {
    try {
        const url = `/app_dgcm_carrito/tienda/obtenerDetalleFactura?id=${facturaId}`;
        const response = await fetch(url);
        const datos = await response.json();

        if (datos.codigo === 1) {
            const { factura, detalle } = datos.data;

            let detalleHTML = `<h4>Factura #${factura.factura_id}</h4>`;
            detalleHTML += `<p>Cliente: ${factura.cliente_nombres} ${factura.cliente_apellidos}</p>`;
            detalleHTML += `<p>Fecha: ${factura.fecha_emision}</p>`;
            detalleHTML += `<table class="table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>`;

            detalle.forEach(item => {
                const subtotal = item.cantidad * item.precio_unitario;
                detalleHTML += `
                    <tr>
                        <td>${item.producto_nombre}</td>
                        <td>${item.cantidad}</td>
                        <td>Q ${parseFloat(item.precio_unitario).toFixed(2)}</td>
                        <td>Q ${subtotal.toFixed(2)}</td>
                    </tr>
                `;
            });

            detalleHTML += `</tbody></table>`;
            detalleHTML += `<h5>Total: Q ${parseFloat(factura.total).toFixed(2)}</h5>`;

            Swal.fire({
                title: 'Detalle de Factura',
                html: detalleHTML,
                width: '80%',
                confirmButtonText: 'Cerrar'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el detalle'
        });
    }
};

// Evento
btnVerCarrito.addEventListener('click', () => modalCarrito.show());
btnVaciarCarrito.addEventListener('click', vaciaCarrito);
btnFinalizarCompra.addEventListener('click', finalizaCompra);
btnVerFacturas.addEventListener('click', verFacturas);

// Al cargar la página
document.addEventListener('DOMContentLoaded', arrancarTienda);
window.verDetalle = verDetalle;
