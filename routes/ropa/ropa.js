'use strict'
const express = require('express');
const ropaController = require('../../controllers/ropa/ropa');
const verificarTokenNegocio = require('../../middlewares/auth_negocio');

var router = express.Router();

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

            rutaDestino += _idNegocio + '/ropas';
            console.log('ruta para ropa: '+rutaDestino);

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
router.post('/save-data', verificarTokenNegocio , ropaController.saveData);
/*RECUPERACION DE TODOS LOS PRODUCTOS QUE SOLO LE PERTENECEN A UN NEGOCIO EN ESPECIFICO*/
router.get('/getAllProductNegocio/:estado?', verificarTokenNegocio , ropaController.getAllProductNegocio);
/*BUSCAR POR ID*/
router.get('/searchproduct/:_id' , ropaController.searchproductId);
/*BUSCAR POR NOMBRE*/
router.get('/searchproductName/:nombre' ,verificarTokenNegocio, ropaController.searchproductName);
/*RECUPERACION DE TODOS LOS PRODUCTOS DE TODOS LOS NEGOCIOS*/
router.get('/getAllClothes', ropaController.getAllProduct);
/*BUSQUEDA DE TODOS LOS PRODUCTOS QUE COINCIDAN CON UN NOMBRE QUE SE MANDE POR PARAMETRO */
router.get('/buscar-por-marca/:marca' , ropaController.buscarMarca);
/*BUSQUEDA SEGUN SEA EL GENERO DE LA PERSONA */
router.get('/search-sexo/:sexo', ropaController.searchSexo );
/*BUSQUEDA SEGUN SEA EL SEXO , TALLA , MARCA DEL PRODUCTO*/
router.get('/search-sexo_talla_marca', ropaController.searchSexoTallaMarca );
//ACTUALIZACION DEL PRODUCTO POR ID DEL NEGOCIO E IDPRODUCTO
router.put('/update-data/:_id', verificarTokenNegocio , ropaController.updateData);
/*ACTIVAR O DESACTIVAR EL PRODUCTO */
router.put('/update-status', verificarTokenNegocio , ropaController.updateStatus);
//ACTUALIZACION DE LAS LINEAS DE TODOS LOS PRODUCTO SEGUN UNA LINEA EN ESPECIFICO
router.put('/update-all-marca', verificarTokenNegocio , ropaController.updateAllMarca);
/*DEVUELVE LA CANTIDAD DE PRODUCTOS EXISTENTES*/
router.get('/countProduct' ,verificarTokenNegocio, ropaController.countProductNegocio);
/*ELIMINACION DEL PRODUCTO */
router.delete('/delete-data/:_id', verificarTokenNegocio , ropaController.deleteData);

/*SUBIDA DE LA IMAGEN DEL PRODUCTO */
router.post('/upload-imagen/:_id',[verificarTokenNegocio ,upload.single('file') ] , ropaController.uploadImage);
/*OBTENER IMAGEN POR NOMBRE , ID DEL PRODUCTO =>QUERY , ID DE LA IMAGEN =>QUERY*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, ropaController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, ropaController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, ropaController.deleteAllImageProduct);
/*AUMENTA LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista' ,ropaController.aumentarVistas );
module.exports = router;