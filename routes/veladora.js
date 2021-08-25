'use strict'
const express = require('express');
const veladoraController = require('../controllers/veladora');
const verificarTokenNegocio = require('../middlewares/auth_negocio');

var router = express.Router();

//SUBIDA DE ARCHIVO
const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
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

            rutaDestino += _idNegocio + '/veladora';

            cb(null, rutaDestino);

        },

        filename: function (req, file, cb) {
            cb(null, Date.now() + "_" + file.originalname);
        }
    }
);
const upload = multer({ storage: storage });

//Rutas
/*GUARDADO DE LOS DATOS DEL PRODUCTO */
router.post('/save-data', verificarTokenNegocio, veladoraController.saveData);
/*RECUPERACION DE TODOS LOS PRODUCTOS QUE SOLO LE PERTENECEN A UN NEGOCIO EN ESPECIFICO*/
router.get('/getAllProductNegocio/:estado?', verificarTokenNegocio, veladoraController.getAllProductNegocio);
/*RECUPERACION DE TODOS LOS PRODUCTOS DE TODOS LOS NEGOCIOS */
router.get('/getAllProduct', veladoraController.getAllProducto);
/*BUSQUEDA DEL PRODUCTO POR ID*/
router.get('/searchproduct/:_id', veladoraController.searchproductId);
/*BUSCAR POR NOMBRE*/
router.get('/searchproductName/:nombre', verificarTokenNegocio, veladoraController.searchproductName);
/*DEVUELVE LA CANTIDAD DE PRODUCTOS EXISTENTES*/
router.get('/countProduct', verificarTokenNegocio, veladoraController.countProductNegocio);
//ACTUALIZACION DEL PRODUCTO POR ID DEL NEGOCIO AL QUE PERTENECE Y SU PROPIO ID
router.put('/update-data/:_id', verificarTokenNegocio, veladoraController.updateDatos);
//ELIMINACION DEL PRODUCTO POR _ID DEL NEGOCIO E _ID DEL PRODUCTO
router.delete('/delete-data/:_id', verificarTokenNegocio, veladoraController.deleteProduct);
//ACTUALIZACION DEL ESTADO DEL PRODUCTO POR _IDNEGOCIO , _IDPRODUCTO, ESTADO (FALSE,  TRUE )  
router.put('/update-status', verificarTokenNegocio, veladoraController.updateStatus);
/*ACTUALIZAR IMAGEN  IDPRODUCTO , ID de la imagen*/
router.put('/updateImage', [verificarTokenNegocio, upload.single('file')], veladoraController.actualizarImage);
/*SUBIDA DE LA IMAGEN DEL PRODUCTO */
router.post('/upload-imagen/:_id',[verificarTokenNegocio ,upload.single('file') ] , veladoraController.uploadImage);
/*OBTENER IMAGEN POR NOMBRE , ID DEL PRODUCTO =>QUERY , ID DE LA IMAGEN =>QUERY*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, veladoraController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, veladoraController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, veladoraController.deleteAllImageProduct);
/*AUMENTAR LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista', veladoraController.aumentarVistas);

module.exports = router;