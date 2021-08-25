'use strict'
const express = require('express');
const busquedaPController = require('../controllers/busqueda_principal_producto');

var router = express.Router();
//Rutas
/*BUSCA EL PRODUCTO EN TODOS LOS NEGOCIO */
router.get('/busqueda_producto/:nombre_producto' , busquedaPController.busqueda_general_producto);
//RECUPERA TODOS LOS PRODUCTOS DEL NEGOCIO EN ESPECIFICO
router.get('/busquedaAllProductoNegocio/:_idnegocio' , busquedaPController.getAllProductoNegocioById);
//BUSCA EL PRODUCTO EN UN NEGOCIO EN ESPECIFICO
router.get('/busqueda_producto_negocio/:_idnegocio/:_nombre' , busquedaPController.findProductNegocio);
/*RECUPERA LOS DATOS DE UN PRODUCTO EN ESPECIFICO INDICANDO EL ID DEL PRODUCTO Y SEGUN EL ARRAY (Abarrote, optica, etc) QUE PERTENECE */
router.get('/getDataByIdNegocioIdProducto/:nameTblSearch/:_idproducto' , busquedaPController.getDataByIdNegocioIdProducto);
/*RECUPERA LA IMAGEN DE UN PRODUCTO INDICANDO EL ID DEL NEGOCIO, NOMBRE DEL ARRAY , NOMBRE DE LA IMAGEN */
router.get('/getImageByIdNegocioNameTable/:_idNegocio/:nameTblSearch/:nameImage' , busquedaPController.getImageByIdNegocioNameTable);
/*RECUPERA TODO LOS PRODUCTOS INDICANDO EL ARRAY(ABARROTE, FARMACIA , FERRETERIA) DE TODOS LOS NEGOCIOS*/
router.get('/busqueda_producto_nameTable/:nameProduct/:nameTblSearch' , busquedaPController.getAllProductByTable);
/*BUSCA EL PRODUCTO EN EL ARRAY ROPAS CON FILTROS DE BUSQUEDA*/
router.get('/busqueda-filtro-ropa' , busquedaPController.busquedaFiltroRopa);
/*BUSCA EL PRODUCTO EN EL ARRAY ZAPATOS CON FILTROS DE BUSQUEDA */
router.get('/busqueda-filtro-calzado' , busquedaPController.busquedaFiltroZapatos);

module.exports = router;