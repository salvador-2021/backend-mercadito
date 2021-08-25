'use strict'
const express = require('express');
const ServicioController = require('../../controllers/servicio/servicio');
const verificarTokenNegocio = require('../../middlewares/auth_negocio');

var router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination:function (req , file , cb){
            try {
                if (typeof req.negocio_autentificado._id === 'undefined') {
                    return res.status(401).send({
                        status: "error",
                        message: "Usuario no identificado"
                    });
    
                }
            } catch (error) {
                return res.status(500).send({
                    status: "error",
                    message: "Usuario no identificadod"
                });
            }
    
            var _idNegocio = req.negocio_autentificado._id;

            var rutaDestino = './uploads/';
            
            rutaDestino += _idNegocio +'/servicios';
            console.log("rutaDestino",rutaDestino);

            cb( null , rutaDestino );
         
        },
        filename: function(req, file, cb){
            cb(null,Date.now()+"_"+file.originalname);
        }
    }
);

const upload = multer( { storage: storage } );

//Rutas
/*GUARDAR DATOS*/
router.post('/save-data', verificarTokenNegocio , ServicioController.save_servicio);
/*RECUPERAR LOS SERVICIOS DEL NEGOCIO */
router.get('/getAllServiceNegocio/:estado?',verificarTokenNegocio, ServicioController.getAllServicioNegocio);
/*RECUPERAR TODOS LOS SERVICIOS DE TODOS LOS SERVICIOS*/
router.get('/getAllService', ServicioController.getAllServicio);
/*BUSCAR EL SERVICIO POR ID*/
router.get('/searchproduct/:_id' , ServicioController.searchproductId);
/*BUSCAR POR NOMBRE*/
router.get('/searchproductName/:nombre' ,verificarTokenNegocio, ServicioController.searchproductName);
/*DEVUELVE LA CANTIDAD DE PRODUCTOS EXISTENTES*/
router.get('/countProduct' ,verificarTokenNegocio, ServicioController.countProductNegocio);
/*ACTUALIZAR DATOS*/
router.put('/update-data/:_id', verificarTokenNegocio , ServicioController.updateDatos);
/*BUSCAR EL SERVICIO INDICANDO EL TIPO DE SERVICIO*/
router.get('/search-tipo', ServicioController.searchServicioTipo ); 
/*ELIMINAR EL SERVICIO*/
router.delete('/delete-data/:_id', verificarTokenNegocio , ServicioController.deleteServicio);
/*ACTUALIZAR EL TIPO DE SERVICIO DE TODOS LOS SERVICIOS*/
router.put('/update-all-tipo-servicio', ServicioController.updateAllTipoServicio);
/*ACTUALIZAR EL ESTADO DEL SERVICIO*/
router.put('/update-status', verificarTokenNegocio , ServicioController.updateStatus);
/*ACTUALIZAR IMAGEN  IDPRODUCTO , ID DE LA IMAGEN*/
router.put('/updateImage',[ verificarTokenNegocio , upload.single('file') ] , ServicioController.actualizarImage );
/*SUBIDA DE LA IMAGEN*/
router.post('/upload-imagen/:_id',[verificarTokenNegocio , upload.single('file') ] , ServicioController.uploadImage);
/*OBTENER IMAGEN POR NOMBRE*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, ServicioController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, ServicioController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, ServicioController.deleteAllImageProduct);
/*AUMENTA LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista' , ServicioController.aumentarVistas );

module.exports = router;