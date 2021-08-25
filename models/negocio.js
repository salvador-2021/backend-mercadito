'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comentarioSchema = Schema({
        _idusuario: { type: String, required: true },
        titulo_comentario: { type: String, required: true },
        comentario: { type: String, required: true },
        estrellas: { type: Number, required: true },
        fecha: { type: Date, default: Date.now },
});

const imagenes = Schema({
        ruta: String
});

const listaTallasRopa = Schema({
        talla: String
});

const listacoloresRopa = Schema({
        color: String
});

const abarroteSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        linea: { type: String, required: true },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        vistas: { type: Number, default: 0 },
        imagen: [imagenes],
        estado: { type: Boolean, default: true },
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        comentarios: [comentarioSchema]
});

const alimentoSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});


const accesorio_movilSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        color: { type: String, required: true },
        otra_inf: { type: String, default: null },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        estado: { type: Boolean, default: true },
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        comentarios: [comentarioSchema]
});



const bicicleta = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        medidas: { type: String, required: true },
        velocidades: { type: String, required: true },
        marca: { type: String, required: true },
        material: { type: String, default: null }, //
        frenos: { type: String, required: true },
        pedales: { type: String, default: null },
        pesoProducto: { type: String, required: true },
        pesoSoportado: { type: String, default: null },
        genero: { type: String, default: null },
        color: { type: String, default: null },
        otra_inf: { type: String, default: null },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const bodegaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        unidadventa: { type: String, required: true },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const computadoraSchema = Schema({
        nombre: { type: String, required: true },
        descripcionPantalla: { type: String, required: true },
        descripcionSO: { type: String, required: true },
        descripcionAlmacenamiento: { type: String, required: true },
        descripcionMemoriaRam: { type: String, required: true },
        MemoriaRamExpandible: { type: String, required: true },
        DescripcionGPU: { type: String, required: true },
        sistemaEnfriamiento: { type: String, required: true },
        tecnologiaDesbloqueo: { type: String, required: true },
        tecnologiaAudio: { type: String, required: true },
        color: { type: String, required: true },
        marca: { type: String, required: true },
        grosor: { type: String, required: true },
        peso: { type: String, required: true },
        cpu: { type: String, required: true },
        marcaCPU: { type: String, required: true },
        modeloCPU: { type: String, required: true },
        generacionCPU: { type: String, required: true },
        velocidadCPU: { type: String, required: true },
        almacenamientoEmmc: { type: String, default: null },
        tipoTeclado: { type: String, required: true },
        resolucion: { type: String, required: true },
        camaraWeb: { type: String, required: true },
        lectorDisco: { type: String, required: true },
        microfono: { type: String, required: true },
        cargador: { type: String, default: null },
        entradaHdmi: { type: String, required: true },
        puertosUsb: { type: String, required: true },
        puertoEthernet: { type: String, required: true },
        tarjetaEthernet: { type: String, required: true },
        bluetooth: { type: String, required: true },
        duracionBateria: { type: String, required: true },
        tipoBateria: { type: String, default: null },
        medidas: { type: String, default: null },
        unidadventa: { type: String, required: true },
        garantia: { type: String, required: true },
        otra_inf: { type: String, default: null },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        estado: { type: Boolean, default: true },
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        comentarios: [comentarioSchema]
});

const celularesSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        tipoPantalla: { type: String, required: true },
        seguridad: { type: String, required: true },
        marca: { type: String, required: true },
        modelo: { type: String, required: true },
        sistemaOperativo: { type: String, required: true },
        altavoces: { type: String, required: true },
        camaraF: { type: String, required: true },
        camaraT: { type: String, required: true },
        tamanioPantalla: { type: String, required: true },
        resolucion: { type: String, required: true },
        bateria: { type: String, default: null },
        memoriaRam: { type: String, required: true },
        color: { type: String, required: true },
        bluetooth: { type: String, required: true },
        interfazCarga: { type: String, required: true },
        almacenamiento: { type: String, required: true },
        procesador: { type: String, required: true },
        garantia: { type: String, required: true },
        unidadventa: { type: String, required: true },
        otra_inf: { type: String, default: null },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        vistas: { type: Number, default: 0 },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const cerrajeriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        unidadventa: { type: String, required: true },
        color: String,
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const camaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        material_relleno: { type: String, default: null },
        tipo_colchon: { type: String, required: true },
        altura: { type: String, required: true },
        ancho: { type: String, required: true },
        grosor: { type: String, required: true },
        marca: { type: String, required: true },
        peso: { type: String, required: true },
        color: { type: String, required: true },
        garantia: { type: String, required: true },
        incluye: { type: String, default: null },
        otra_inf: { type: String, default: null },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});


const carpinteriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        medidas: { type: String, default: null },
        color: { type: String, default: null },
        unidadventa: { type: String, required: true },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const carniceriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});


const construccionSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        especificacion: { type: String, default: null },
        marca: { type: String, required: true },
        categoria: { type: String, required: true },
        unidadventa: { type: String, required: true },
        peso: { type: String, required: true },
        medidas: { type: String, required: true },
        otra_inf: { type: String, default: null },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const dentistaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        uso: { type: String, default: null },
        unidadventa: { type: String, required: true },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const fruteriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const farmaciaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        categoria: { type: String, required: true },
        unidadventa: { type: String, required: true },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const fotoSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        medidas: { type: String, default: null },
        color: { type: String, default: null },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const ferreteriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        especificacion: { type: String, default: null },
        unidadventa: { type: String, required: true },
        uso: { type: String, default: null },
        incluye: { type: String, default: null },
        marca: { type: String, required: true },
        modelo: { type: String, default: null },
        peso: { type: String, default: null },
        medidas: { type: String, default: null },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const fierroSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        unidadventa: { type: String, required: true },
        medidas: { type: String, default: null },
        color: { type: String, default: null },
        otra_inf: { type: String, default: null },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const floreriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        tema: { type: String, required: true },
        unidadventa: { type: String, required: true },
        precio: { type: Number, required: true },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});


const funerariaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        unidadventa: { type: String, required: true },
        medidas: { type: String, required: true },
        persona: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const herreriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        incluye: { type: String, default: null },
        medidas: { type: String, default: null },
        color: { type: String, default: null },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const hivernaderoSchema = Schema({
        nombre: { type: String, required: true },
        instru_cuidado: { type: String, default: null },
        otra_inf: { type: String, default: null },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const joyeriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        marca: { type: String, default: null },
        kilataje: { type: String, required: true },
        color: { type: String, require: true },
        unidadventa: { type: String, required: true },
        genero: { type: String, required: true },
        acabado: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});


const muebleSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },//
        especificacion: { type: String, required: true },//
        alto: { type: String, required: true },
        ancho: { type: String, required: true },
        profundidad: { type: String, required: true },
        peso: { type: String, required: true },
        unidadventa: { type: String, required: true }, //
        color: { type: String, required: true },
        marca: { type: String, default: null },
        tipo_acabado: { type: String, default: null },
        recomendacion_uso: { type: String, default: null },
        otra_inf: { type: String, default: null },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const motoSchema = Schema({
        nombre: { type: String, required: true },
        descrip_motor: { type: String, required: true },
        marca: { type: String, default: null },
        transmision: { type: String, required: true },
        potencia_max: { type: String, required: true },
        torque_max: { type: String, required: true },
        peso_maxCarga: { type: String, required: true },
        peso_moto: { type: String, required: true },
        refrigeracion: { type: String, required: true },
        bateria: { type: String, required: true },
        suspen_Trasera: { type: String, required: true },
        suspen_delantera: { type: String, required: true },
        llanta_trasera: { type: String, required: true },
        llanta_delantera: { type: String, required: true },
        ancho: { type: String, required: true },
        altura: { type: String, required: true },
        anio_modelo: { type: String, required: true },
        capacidad_tanque: { type: String, required: true },
        cilindraje: { type: String, required: true },
        color: { type: String, required: true },
        garantia: { type: String, required: true },
        otra_inf: { type: String, default: null },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const opticaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        incluye: { type: String, default: null },
        unidadventa: { type: String, required: true },  //
        marca: { type: String, required: true },
        numero: { type: String, required: true },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const plomeriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        especificacion: { type: String, default: null },
        marca: { type: String, required: true },
        unidadventa: { type: String, required: true },
        garantia: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const papeleriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        especificacion: { type: String, default: null },
        medidas: { type: String, default: null },
        color: { type: String, default: null },
        unidadventa: { type: String, required: true },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const pinturaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        litros: { type: String, required: true },
        unidadventa: { type: String, required: true },
        marca: { type: String, required: true },
        color: { type: String, required: true },
        otra_inf: { type: String, default: null },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});
const relojeriaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        especificacion: { type: String, default: null },
        marca: { type: String, required: true },
        modelo: { type: String, default: null },
        caratula: { type: String, default: null },
        color: { type: String, required: true },
        unidadventa: { type: String, required: true },
        genero: { type: String, required: true },
        funcionamiento: { type: String, default: null },
        garantia: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const ropaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        detalle: { type: String, default: null },
        marca: { type: String, required: true },
        tipo_ropa: { type: String, required: true },
        genero: { type: String, required: true },
        tallas: { type: [listaTallasRopa], required: true },
        colores: { type: [listacoloresRopa], required: true },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        vistas: { type: Number, default: 0 },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});


const servicioSchema = Schema({
        tipo_servicio: { type: String, required: true }, //mecanico , optica , odontologia , pediatria , consultorio medico ...etc
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        vistas: { type: Number, default: 0 },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});


const telaSchema = Schema({
        nombre: { type: String, required: true },
        tipo_tela: { type: String, required: true },
        medidas: { type: String, required: true },
        otra_inf: { type: String, default: null },
        color: { type: String, required: true },
        unidadventa: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const veladoraSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        unidadventa: { type: String, required: true },
        medidas: { type: String, required: true },
        color: { type: String, required: true },
        otra_inf: { type: String, default: null },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const calzadoSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        tipo_calzado: { type: String, required: true },
        detalle: { type: String, required: true },
        marca: { type: String, required: true },
        unidadventa: { type: String, required: true },
        genero: { type: String, required: true },
        garantia: { type: String, required: true },
        otra_inf: { type: String, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        existencia: { type: Number, required: true },
        tallas: { type: [listaTallasRopa], required: true },
        colores: { type: [listacoloresRopa], required: true },
        vistas: { type: Number, default: 0 },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});


const perfilSchema = Schema({
        nombre_responsable: { type: String, required: true },
        cedula_profesional: { type: String, required: true },
        especializacion: { type: String, required: true },
        imagen: { type: String, default: null }
});


//----------->ELECTRODOMESTICOS<-------------
const microondaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        unidadventa: { type: String, required: true },
        voltaje: { type: String, required: true },
        potencia: { type: String, required: true },
        color: { type: String, required: true },
        medidas: { type: String, required: true },
        luz_interior: { type: String, required: true },
        reloj: { type: String, required: true },
        panel_control: { type: String, required: true },
        peso: { type: String, required: true },
        temporizador: { type: String, default: null },
        acabado: { type: String, default: null },
        incluye: { type: String, default: null },
        garantia: { type: String, required: true },
        otra_inf: { type: String, default: null },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const licuadoraSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        unidadventa: { type: String, required: true },
        modelo: { type: String, required: true },
        marca: { type: String, required: true },
        color: { type: String, required: true },
        accesorios: { type: String, default: null },
        voltaje: { type: String, required: true },
        potencia: { type: String, required: true },
        velocidades: { type: String, required: true },
        capacidad: { type: String, required: true },
        material: { type: String, required: true },
        peso: { type: String, required: true },
        incluye: { type: String, default: null },
        garantia: { type: String, required: true },
        otra_inf: { type: String, default: null },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const planchaSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        unidadventa: { type: String, required: true },
        marca: { type: String, required: true },
        color: { type: String, required: true },
        potencia: { type: String, required: true },
        medidas: { type: String, required: true },
        peso: { type: String, required: true },
        tipo_suela: { type: String, required: true },
        garantia: { type: String, required: true },
        otra_inf: { type: String, default: null },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const refrigeradorSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, default: null },
        marca: { type: String, required: true },
        color: { type: String, required: true },
        ancho: { type: String, required: true },
        alto: { type: String, required: true },
        profundidad: { type: String, required: true },
        filtro_agua: { type: String, required: true },
        peso: { type: String, required: true },
        acabado: { type: String, required: true },
        material: { type: String, required: true },
        luz_interior: { type: String, required: true },
        voltaje: { type: String, required: true },
        control_humedad: { type: String, required: true },
        no_puertas: { type: String, required: true },
        despachador_agua: { type: String, required: true },
        compartimientos: { type: String, required: true },
        unidadventa: { type: String, required: true },
        garantia: { type: String, required: true },
        otra_inf: { type: String, default: null },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});




const televisionSchema = Schema({
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        pantalla: { type: String, required: true },
        puertos: { type: String, required: true },
        marca: { type: String, required: true },
        anio_modelo: { type: String, required: true },
        medidas: { type: String, required: true },
        pulgadas: { type: String, required: true },
        v_t: { type: String, required: true },
        garantia: { type: String, required: true },
        altavoces: { type: String, required: true },
        pantalla_curva: { type: String, default: null },
        otra_inf: { type: String, required: true },
        unidadventa: { type: String, required: true },
        existencia: { type: Number, required: true },
        //PRECIO ACTUAL, PRECIO ANTERIOR, PARA SACAR EL DESCUENTO DEL PRODUCTO
        precio: { type: Number, required: true },
        precio_anterior: { type: Number, required: true },
        imagen: [imagenes],
        fecha: { type: Date, default: Date.now },
        //FECHAS DE PROMOCION
        fecha_inicio: { type: Date, default: null },
        fecha_fin: { type: Date, default: null },
        estado: { type: Boolean, default: true },
        comentarios: [comentarioSchema]
});

const lineaNegocioSchema = Schema({
        linea: { type: String, required: true },
        titulo_linea: { type: String, required: true },
        routerLink: { type: String, required: true }
});

const pagosSchema = Schema({
        nombre_cliente: { type: String, required: true },//NOMBRE DEL CLIENTE QUE ESTA PAGANDO
        monto: { type: String, required: true }, //MONTO A PAGAR
        fecha: { type: Date, default: Date.now }, //FECHA QUE SE ESTA PAGANDO
        id_card : {type:String , required:true}
});

//TODO://ESTE CODIGO SE VA A CAMBIAR DESPUES
const negocioSchema = Schema({
        estadoL: { type: String, required: true }, // estado (lugar)
        municipio: { type: String, required: true },
        localidad: { type: String, required: true },
        nombre: { type: String, required: true },
        direccion: { type: String, required: true },
        telefono: String,
        celular: { type: String, required: true },
        facebook: String,
        horario_ser: { type: String, required: true },
        correo: { type: String, required: true },
        password: { type: String, required: true },
        imagen_negocio: { type: String, default: null },
        vistas: { type: Number, default: 0 },
        estado: { type: Boolean, default: true }, //LA CUENTA ESTA ACTIVA CUANDO INICIA
        fecha_reg: { type: Date, default: Date.now },
        fecha_pago: { type: Date, default: Date.now },
        monto_mensual:{type:Number, default:100},
        estado_pag: { type: Boolean, default: true }, //ESTE CODIGO SE VA A CAMMBIAR DESPUES
        terminosYcondiciones:{type:Boolean, default:true},
        lineaNegocio: [lineaNegocioSchema],
        perfil: perfilSchema,
        abarrote: [abarroteSchema],
        alimento: [alimentoSchema],
        accesorio_movil: [accesorio_movilSchema],
        bicicleta: [bicicleta],
        bodega: [bodegaSchema],
        computadora: [computadoraSchema],
        celulares: [celularesSchema],
        cerrajeria: [cerrajeriaSchema],
        cama: [camaSchema],
        carpinteria: [carpinteriaSchema],
        carniceria: [carniceriaSchema],
        construccion: [construccionSchema],
        dentista: [dentistaSchema],
        fruteria: [fruteriaSchema],
        farmacia: [farmaciaSchema],
        fotos: [fotoSchema],
        ferreteria: [ferreteriaSchema],
        fierro: [fierroSchema],
        floreria: [floreriaSchema],
        funeraria: [funerariaSchema],
        herreria: [herreriaSchema],
        hivernadero: [hivernaderoSchema],
        joyeria: [joyeriaSchema],
        licuadora: [licuadoraSchema],
        muebleria: [muebleSchema],
        microonda: [microondaSchema],
        moto: [motoSchema],
        optica: [opticaSchema],
        plomeria: [plomeriaSchema],
        papeleria: [papeleriaSchema],
        pintura: [pinturaSchema],
        plancha: [planchaSchema],
        relojeria: [relojeriaSchema],
        ropas: [ropaSchema],
        refrigerador: [refrigeradorSchema],
        servicios: [servicioSchema],
        tela: [telaSchema],
        television: [televisionSchema],
        veladora: [veladoraSchema],
        zapatos: [calzadoSchema],
        pagos: [pagosSchema]
});
//camara

module.exports = mongoose.model('negocio', negocioSchema);
    //negocios---> guarda documentos de este tipo y con estructura dentro de la colección


