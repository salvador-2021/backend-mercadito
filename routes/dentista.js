'use strict'
const express = require('express');
const dentistaController = require('../controllers/dentista');
const verificarTokenNegocio = require('../middlewares/auth_negocio');

var router = express.Router();

//SUBIDA DE ARCHIVO
const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination:function (req , file , cb){
            try {
                if (typeof req.negocio_autentificado._id === 'undefined') {
                    return res.status(400).send({
                        status: "error",
                        message: "Usuario no identificado"
                    });
    
                }
            } catch (error) {
                return res.status(400).send({
                    status: "error",
                    message: "Usuario no identificadod"
                });
            }
    
            var _idNegocio = req.negocio_autentificado._id;

            var rutaDestino = './uploads/';

            rutaDestino += _idNegocio + '/dentista';

            cb( null , rutaDestino );
         
        },

        filename: function(req, file, cb){
            cb(null,Date.now()+"_"+file.originalname);
        }
    }
);
const upload = multer( { storage: storage } );

//Rutas
/*GUARDADO DE LOS DATOS DEL PRODUCTO */
router.post('/save-datos', verificarTokenNegocio , dentistaController.saveData);
/*RECUPERACION DE TODOS LOS PRODUCTOS QUE SOLO LE PERTENECEN A UN NEGOCIO EN ESPECIFICO*/
router.get('/getAllProductNegocio', verificarTokenNegocio , dentistaController.getAllProductNegocio);
/*RECUPERACION DE TODOS LOS PRODUCTOS DE TODOS LOS NEGOCIOS */
router.get('/getAllProduct', dentistaController.getAllProducto);
/*BUSQUEDA DEL PRODUCTO SEGUN SEA SU NOMBRE O SI SE DESEA BUSCAR POR ID*/
router.get('/buscar-por-nombre/:_id?' , dentistaController.buscarProductoNombre);
//ACTUALIZACION DEL PRODUCTO POR ID DEL NEGOCIO AL QUE PERTENECE Y SU PROPIO ID
router.put('/update-datos/:_id', verificarTokenNegocio , dentistaController.updateDatos);
//ELIMINACION DEL PRODUCTO POR _ID DEL NEGOCIO E _ID DEL PRODUCTO
router.delete('/delete-product/:_id', verificarTokenNegocio , dentistaController.deleteProduct);
//ACTUALIZACION DEL ESTADO DEL PRODUCTO POR _IDNEGOCIO , _IDPRODUCTO, ESTADO (FALSE,  TRUE )  
router.put('/update-status', verificarTokenNegocio , dentistaController.updateStatus);
/*SUBIDA DE LA IMAGEN DEL PRODUCTO */
router.post('/upload-imagen/:_id',[ verificarTokenNegocio , upload.single('file') ]  , dentistaController.uploadImage);
/*ACTUALIZAR IMAGEN  IDPRODUCTO , ID de la imagen*/
router.put('/updateImage',[ verificarTokenNegocio , upload.single('file') ] , dentistaController.actualizarImage );
/*OBTENER IMAGEN POR NOMBRE , ID DEL PRODUCTO =>QUERY , ID DE LA IMAGEN =>QUERY*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, dentistaController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, dentistaController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, dentistaController.deleteAllImageProduct);
/*AUMENTAR LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista' ,dentistaController.aumentarVistas );

module.exports = router;