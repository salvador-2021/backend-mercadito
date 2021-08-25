'use strict'
const express = require('express');
const cerrajeriaController = require('../controllers/cerrajeria');
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
            
            rutaDestino += _idNegocio +'/cerrajeria';

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
router.post('/save-data', verificarTokenNegocio , cerrajeriaController.saveData);
/*ACTUALIZA LOS DATOS DEL PRODUCTO PO ID */
router.put('/update-data/:_id', verificarTokenNegocio , cerrajeriaController.updateData);
/*RECUPERA TODOS LOS PRODUCTOS DEL NEGOCIO QUE ESTA EN LOGUEO*/
router.get('/getAllProductNegocio/:estado?', verificarTokenNegocio , cerrajeriaController.getAllProductNegocio);
/*RECUPERA TODO LOS ZAPATOS DE TODO LOS NEGOCIOS */
router.get('/getAllProduct', cerrajeriaController.getAllProduct);
/*BUSCA LOS PRODUCTOS POR MARCA */
router.get('/searchproduct/:_id' , cerrajeriaController. searchproductId);
/*BUSQUEDA DEL PRODUCTO POR NOMBRE*/
router.get('/searchproductName/:nombre' ,verificarTokenNegocio, cerrajeriaController.searchproductName);
/*DEVUELVE LA CANTIDAD DE PRODUCTOS EXISTENTES*/
router.get('/countProduct' ,verificarTokenNegocio, cerrajeriaController.countProductNegocio);
/*ACTUALIZA EL ESTADO DEL PRODUCTO POR ID */
router.put('/update-status', verificarTokenNegocio , cerrajeriaController.updateStatus);
/*ELIMINA LOS DATOS DEL PRODUCTO POR ID */
router.delete('/delete-data/:_id', verificarTokenNegocio , cerrajeriaController.deleteData);
/*SUBIDA DE LA IMAGEN */
router.post('/upload-imagen/:_id',[verificarTokenNegocio , upload.single('file') ] , cerrajeriaController.uploadImage);
/*ACTUALIZAR IMAGEN  IDPRODUCTO , ID de la imagen*/
router.put('/updateImage',[ verificarTokenNegocio , upload.single('file') ] , cerrajeriaController.actualizarImage );
/*OBTENER IMAGEN POR NOMBRE*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, cerrajeriaController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, cerrajeriaController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, cerrajeriaController.deleteAllImageProduct);
/*AUMENTA LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista' ,cerrajeriaController.aumentarVistas );
module.exports = router;