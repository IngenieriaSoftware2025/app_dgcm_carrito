<?php

namespace Model;

class Clientes extends ActiveRecord {
    protected static $tabla = 'clientes';
    public static $idTabla = 'cliente_id';
    protected static $columnasDB = [
        'cliente_nombres',
        'cliente_apellidos',
        'cliente_nit',
        'cliente_telefono',
        'cliente_correo',
        'cliente_fecha',
        'cliente_situacion'
    ];
    public $cliente_id;
    public $cliente_nombres;
    public $cliente_apellidos;
    public $cliente_nit;
    public $cliente_telefono;
    public $cliente_correo;
    public $cliente_fecha;
    public $cliente_situacion;

    public function __construct($args = []) {
        $this->cliente_id = $args['cliente_id'] ?? null;
        $this->cliente_nombres = $args['cliente_nombres'] ?? '';
        $this->cliente_apellidos = $args['cliente_apellidos'] ?? '';
        $this->cliente_nit = $args['cliente_nit'] ?? 0;
        $this->cliente_telefono = $args['cliente_telefono'] ?? 0;
        $this->cliente_correo = $args['cliente_correo'] ?? '';
        $this->cliente_fecha = $args['cliente_fecha'] ?? date('Y-m-d H:i:s');
        $this->cliente_situacion = $args['cliente_situacion'] ?? 1;
    }

    public static function EliminarClientes($id) {
        $sql = "DELETE FROM clientes WHERE cliente_id = $id";
        return self::SQL($sql);
    }
}