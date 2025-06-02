import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import { validarFormulario } from '../funciones';
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";
import { data } from "jquery";

const FormProductos = document.getElementById('FormProductos');
const BtnGuardar = document.getElementById('BtnGuardar');
const BtnModificar = document.getElementById('BtnModificar');
const BtnLimpiar = document.getElementById('BtnLimpiar');

const GuardarProducto = async (event) => {

    event.preventDefault();
    BtnGuardar.disabled = true;

    if (!validarFormulario(FormProductos, ['producto_id'])) {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "FORMULARIO INCOMPLETO",
            text: "Debe de validar todos los campos",
            showConfirmButton: true,
        });
        BtnGuardar.disabled = false;
    }

    const body = new FormData(FormProductos);

    const url = '/app_dgcm_carrito/productos/guardarAPI';
    const config = {
        method: 'POST',
        body
    }

    try {

        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        console.log(datos)
        const { codigo, mensaje } = datos

        if (codigo == 1) {

            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Exito",
                text: mensaje,
                showConfirmButton: true,
            });

            limpiarTodo();
            BuscarProductos();

        } else {

            await Swal.fire({
                position: "center",
                icon: "info",
                title: "Error",
                text: mensaje,
                showConfirmButton: true,
            });

        }


    } catch (error) {
        console.log(error)
    }
    BtnGuardar.disabled = false;

}

const BuscarProductos = async () => {

    const url = '/app_dgcm_carrito/productos/buscarAPI';
    const config = {
        method: 'GET'
    }

    try {

        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, data } = datos

        if (codigo == 1) {

            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Exito",
                text: mensaje,
                showConfirmButton: true,
            });

            datatable.clear().draw();
            datatable.rows.add(data).draw();

        } else {

            await Swal.fire({
                position: "center",
                icon: "info",
                title: "Error",
                text: mensaje,
                showConfirmButton: true,
            });
        }


    } catch (error) {
        console.log(error)
    }
}


const datatable = new DataTable('#TableProductos', {
    dom: `
        <"row mt-3 justify-content-between" 
            <"col" l> 
            <"col" B> 
            <"col-3" f>
        >
        t
        <"row mt-3 justify-content-between" 
            <"col-md-3 d-flex align-items-center" i> 
            <"col-md-8 d-flex justify-content-end" p>
        >
    `,
    language: lenguaje,
    data: [],
    columns: [
        {
            title: 'No.',
            data: 'producto_id',
            width: '%',
            render: (data, type, row, meta) => meta.row + 1
        },
        { title: 'Producto', data: 'producto_nombre' },
        { title: 'Descripcion', data: 'producto_descripcion' },
        { title: 'Precio', data: 'producto_precio' },
        { title: 'Cantidad ', data: 'producto_cantidad' },
        {
            title: 'Acciones',
            data: 'producto_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                 <div class='d-flex justify-content-center'>
                     <button class='btn btn-warning modificar mx-1' 
                         data-id="${data}" 
                         data-producto="${row.producto_nombre}"  
                         data-descripcion="${row.producto_descripcion}"  
                         data-precio="${row.producto_precio}"  
                         data-cantidad="${row.producto_cantidad}" 
                         <i class='bi bi-pencil-square me-1'></i> Modificar
                     </button>
                     <button class='btn btn-danger eliminar mx-1' 
                         data-id="${data}">
                        <i class="bi bi-trash3 me-1"></i>Eliminar
                     </button>
                 </div>`;
            }
        }
    ]
});


const llenarFormulario = (event) => {

    const datos = event.currentTarget.dataset

    document.getElementById('producto_id').value = datos.id;
    document.getElementById('producto_nombre').value = datos.producto;
    document.getElementById('producto_descripcion').value = datos.descripcion;
    document.getElementById('producto_precio').value = datos.precio;
    document.getElementById('producto_cantidad').value = datos.cantidad;

    BtnGuardar.classList.add('d-none');
    BtnModificar.classList.remove('d-none');

    window.scrollTo({
        top: 0
    });

}

const limpiarTodo = () => {

    FormProductos.reset();
    BtnGuardar.classList.remove('d-none');
    BtnModificar.classList.add('d-none');
}



const ModificarProducto = async (event) => {

    event.preventDefault();
    BtnModificar.disabled = true;

    if (!validarFormulario(FormProductos, [''])) {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "FORMULARIO INCOMPLETO",
            text: "Debe de validar todos los campos",
            showConfirmButton: true,
        });
        BtnGuardar.disabled = false;
    }

    const body = new FormData(FormProductos);

    const url = '/app_dgcm_carrito/productos/modificarAPI';
    const config = {
        method: 'POST',
        body
    }

    try {

        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje } = datos

        if (codigo == 1) {

            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Exito",
                text: mensaje,
                showConfirmButton: true,
            });

            limpiarTodo();
            BuscarProductos();

        } else {

            await Swal.fire({
                position: "center",
                icon: "info",
                title: "Error",
                text: mensaje,
                showConfirmButton: true,
            });

        }


    } catch (error) {
        console.log(error)
    }
    BtnModificar.disabled = false;

}


const EliminarProductos = async (e) => {
    const idProducto = e.currentTarget.dataset.id;

    const AlertaConfirmarEliminar = await Swal.fire({
        position: "center",
        icon: "warning",
        title: "¿Desea ejecutar esta acción?",
        text: 'Esta completamente seguro que desea eliminar este registro',
        showConfirmButton: true,
        confirmButtonText: 'Si, Eliminar',
        confirmButtonColor: '#d33',
        cancelButtonText: 'No, Cancelar',
        showCancelButton: true
    });

    if (AlertaConfirmarEliminar.isConfirmed) {
        const url = `/app_dgcm_carrito/productos/eliminar?id=${idProducto}`;
        const config = {
            method: 'GET'
        };

        try {
            const consulta = await fetch(url, config);
            const respuesta = await consulta.json();
            const { codigo, mensaje } = respuesta;

            if (codigo == 1) {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Eliminado",
                    text: mensaje,
                    showConfirmButton: true,
                });
                BuscarProductos();
            } else {
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "No se puede eliminar",
                    text: mensaje,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6'
                });
            }
        } catch (error) {
            console.log(error);
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor",
                showConfirmButton: true,
            });
        }
    }
};



BuscarProductos();
datatable.on('click', '.eliminar', EliminarProductos);
datatable.on('click', '.modificar', llenarFormulario);
FormProductos.addEventListener('submit', GuardarProducto);
BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', ModificarProducto);