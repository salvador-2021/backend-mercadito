'use strict'
const express = require('express');
const alimentoController = require('../controllers/alimento');
const verificarTokenNegocio = require('../middlewares/auth_negocio');

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
                    message: "Usuario no identificado"
                });
            }
    
            var _idNegocio = req.negocio_autentificado._id;

            var rutaDestino = './uploads/';
            
            rutaDestino += _idNegocio +'/alimento';

            cb( null , rutaDestino );
         
        },
        filename: function(req, file, cb){
            cb(null,Date.now()+"_"+file.originalname);
        }
    }
);

const upload = multer( { storage: storage } );

//Rutas
/*GUARDA LOS DATOS DEL PRODUCTO */
router.post('/save-data', verificarTokenNegocio , alimentoController.saveData);
/*ACTUALIZA LOS DATOS DEL PRODUCTO PO ID */
router.put('/update-data/:_id', verificarTokenNegocio , alimentoController.updateData);
/*RECUPERA TODOS LOS PRODUCTO DEL NEGOCIO QUE ESTA EN LOGUEO*/
router.get('/getAllProductNegocio/:estado?', verificarTokenNegocio , alimentoController.getAllProductNegocio);
/*RECUPERA TODO LOS PRODUCTO DE TODO LOS NEGOCIOS */
router.get('/getAllProduct', alimentoController.getAllProduct);
/*BUSQUEDA DEL PRODUCTO POR ID*/
router.get('/searchproduct/:_id' , alimentoController.searchproductId);
/*BUSQUEDA DEL PRODUCTO POR NOMBRE*/
router.get('/searchproductName/:nombre' ,verificarTokenNegocio, alimentoController.searchproductName);
/*DEVUELVE LA CANTIDAD DE PRODUCTOS EXISTENTES*/
router.get('/countProduct' ,verificarTokenNegocio, alimentoController.countProductNegocio);
//ACTUALIZACION DEL ESTADO DEL PRODUCTO POR _IDNEGOCIO , _IDPRODUCTO, ESTADO (FALSE,  TRUE )  
router.put('/update-status', verificarTokenNegocio , alimentoController.updateStatus);
/*ELIMINA LOS DATOS DEL PRODUCTO POR ID */
router.delete('/delete-data/:_id', verificarTokenNegocio , alimentoController.deleteData);
/*SUBIDA DE LA IMAGEN */
router.post('/upload-imagen/:_id',[verificarTokenNegocio , upload.single('file') ] , alimentoController.uploadImage);
/*ACTUALIZAR IMAGEN  IDPRODUCTO , ID de la imagen*/
router.put('/updateImage',[ verificarTokenNegocio , upload.single('file') ] , alimentoController.actualizarImage );
/*OBTENER IMAGEN POR NOMBRE*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, alimentoController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, alimentoController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, alimentoController.deleteAllImageProduct);
/*AUMENTA LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista' ,alimentoController.aumentarVistas);
module.exports = router;