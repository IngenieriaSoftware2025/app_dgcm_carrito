import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import { validarFormulario } from '../funciones';
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";
import { data } from "jquery";

const FormClientes = document.getElementById('FormClientes');
const BtnGuardar = document.getElementById('BtnGuardar');
const BtnModificar = document.getElementById('BtnModificar');
const BtnLimpiar = document.getElementById('BtnLimpiar');
const inputClienteTelefono = document.getElementById('cliente_telefono');
const cliente_nit = document.getElementById('cliente_nit');


const ValidarTelefono = () => {

    const CantidadDigitos = inputClienteTelefono.value


    if (CantidadDigitos.length < 1) {

        inputClienteTelefono.classList.remove('is-valid', 'is-invalid');

    } else {

        if (CantidadDigitos.length != 8) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Revise el numero de telefono",
                text: "La cantidad de digitos debe ser mayor o igual 8  digitos",
                showConfirmButton: true,
            });

            inputClienteTelefono.classList.remove('is-valid');
            inputClienteTelefono.classList.add('is-invalid');

        } else {
            inputClienteTelefono.classList.remove('is-invalid');
            inputClienteTelefono.classList.add('is-valid');
        }

    }
}


function validarNit() {
    const nit = cliente_nit.value.trim();

    let nd, add = 0;

    if (nd = /^(\d+)-?([\dkK])$/.exec(nit)) {
        nd[2] = (nd[2].toLowerCase() === 'k') ? 10 : parseInt(nd[2], 10);

        for (let i = 0; i < nd[1].length; i++) {
            add += ((((i - nd[1].length) * -1) + 1) * parseInt(nd[1][i], 10));
        }
        return ((11 - (add % 11)) % 11) === nd[2];
    } else {
        return false;
    }
}

const EsValidoNit = () => {

    validarNit();

    if (validarNit()) {
        cliente_nit.classList.add('is-valid');
        cliente_nit.classList.remove('is-invalid');
    } else {
        cliente_nit.classList.remove('is-valid');
        cliente_nit.classList.add('is-invalid');

        Swal.fire({
            position: "center",
            icon: "error",
            title: "NIT INVALIDO",
            text: "El numero de nit ingresado es invalido",
            showConfirmButton: true,
        });

    }
}


const guardarCliente = async (event) => {

    event.preventDefault();
    BtnGuardar.disabled = true;

    if (!validarFormulario(FormClientes, ['cliente_id'])) {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "Formulario Incompleto",
            text: "Debe de validar todos los campos",
            showConfirmButton: true,
        });
        BtnGuardar.disabled = false;
    }

    const body = new FormData(FormClientes);

    const url = '/app_dgcm_carrito/clientes/guardarAPI';
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
            buscarClientes();

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

const buscarClientes = async () => {

    const url = '/app_dgcm_carrito/clientes/buscarAPI';
    const config = {
        method: 'GET'
    }

    try {

        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        const { codigo, mensaje, clientes } = datos

        if (codigo == 1) {

            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Exito",
                text: mensaje,
                showConfirmButton: true,
            });

            datatable.clear().draw();
            datatable.rows.add(clientes).draw();

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

const irATienda = (event) => {
    const datos = event.currentTarget.dataset;
    const clienteId = datos.id;
    const nombreCompleto = `${datos.nombre} ${datos.apellidos}`;

    localStorage.setItem('clienteSeleccionado', JSON.stringify({
        id: clienteId,
        nombre: nombreCompleto
    }));

    window.location.href = '/app_dgcm_carrito/tienda';
};

const datatable = new DataTable('#TableClientes', {
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
            data: 'cliente_id',
            width: '%',
            render: (data, type, row, meta) => meta.row + 1
        },
        { title: 'Nombre', data: 'cliente_nombres' },
        { title: 'Apellidos', data: 'cliente_apellidos' },
        { title: 'Correo ', data: 'cliente_correo' },
        { title: 'Telefono ', data: 'cliente_telefono' },
        { title: 'Nit', data: 'cliente_nit' },
        { title: 'Fecha', data: 'cliente_fecha' },
        {
            title: 'Acciones',
            data: 'cliente_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                <div class='d-flex justify-content-center'>
                    <button class='btn btn-warning modificar mx-1' 
                        data-id="${data}" 
                        data-nombre="${row.cliente_nombres}"  
                        data-apellidos="${row.cliente_apellidos}"  
                        data-nit="${row.cliente_nit}"  
                        data-telefono="${row.cliente_telefono}"  
                        data-correo="${row.cliente_correo}"   
                        data-fecha="${row.cliente_fecha}"  
                        <i class='bi bi-pencil-square me-1'></i> Modificar
                    </button>
                    <button class='btn btn-danger eliminar mx-1' 
                        data-id="${data}">
                        <i class="bi bi-trash3 me-1"></i>Eliminar
                    </button>
                    <button class='btn btn-success tienda mx-1' 
                        data-id="${data}" 
                        data-nombre="${row.cliente_nombres}"
                        data-apellidos="${row.cliente_apellidos}">
                        <i class="bi bi-shop me-1"></i>Ir a Tienda
                    </button>
                </div>`;
            }
        }
    ]
});


const llenarFormulario = (event) => {

    const datos = event.currentTarget.dataset

    document.getElementById('cliente_id').value = datos.id
    document.getElementById('cliente_nombres').value = datos.nombre
    document.getElementById('cliente_apellidos').value = datos.apellidos
    document.getElementById('cliente_nit').value = datos.nit
    document.getElementById('cliente_telefono').value = datos.telefono
    document.getElementById('cliente_correo').value = datos.correo
    document.getElementById('cliente_fecha').value = datos.fecha

    BtnGuardar.classList.add('d-none');
    BtnModificar.classList.remove('d-none');

    window.scrollTo({
        top: 0
    });

}

const limpiarTodo = () => {

    FormClientes.reset();
    BtnGuardar.classList.remove('d-none');
    BtnModificar.classList.add('d-none');
}



const modificarCliente = async (event) => {

    event.preventDefault();
    BtnModificar.disabled = true;

    if (!validarFormulario(FormClientes, [''])) {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "Formulario Incompleto",
            text: "Debe de validar todos los campos",
            showConfirmButton: true,
        });
        BtnGuardar.disabled = false;
    }

    const body = new FormData(FormClientes);

    const url = '/app_dgcm_carrito/clientes/modificarAPI';
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
            buscarClientes();

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


const eliminarClientes = async (e) => {

    const idCliente = e.currentTarget.dataset.id

    const AlertaConfirmarEliminar = await Swal.fire({
        position: "center",
        icon: "info",
        title: "¿Desea ejecutar esta acción?",
        text: 'Esta completamente seguro que desea eliminar este registro',
        showConfirmButton: true,
        confirmButtonText: 'Si, Eliminar',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, Cancelar',
        showCancelButton: true
    });

    if (AlertaConfirmarEliminar.isConfirmed) {

        const url = `/app_dgcm_carrito/clientes/eliminar?id=${idCliente}`;
        const config = {
            method: 'GET'
        }

        try {

            const consulta = await fetch(url, config);
            const respuesta = await consulta.json();
            const { codigo, mensaje } = respuesta;

            if (codigo == 1) {

                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Exito",
                    text: mensaje,
                    showConfirmButton: true,
                });

                buscarClientes();
            } else {
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error",
                    text: mensaje,
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.log(error)
        }

    }

}



buscarClientes();
datatable.on('click', '.eliminar', eliminarClientes);
datatable.on('click', '.modificar', llenarFormulario);
datatable.on('click', '.tienda', irATienda);
FormClientes.addEventListener('submit', guardarCliente);
cliente_nit.addEventListener('change', EsValidoNit);
inputClienteTelefono.addEventListener('change', ValidarTelefono);
BtnLimpiar.addEventListener('click', limpiarTodo);
BtnModificar.addEventListener('click', modificarCliente);