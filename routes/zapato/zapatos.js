'use strict'
const express = require('express');
const ZapatosController = require('../../controllers/zapato/zapatos');
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
            
            rutaDestino += _idNegocio +'/zapatos';

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
router.post('/save-data', verificarTokenNegocio , ZapatosController.saveData);
/*RECUPERACION DE TODOS LOS PRODUCTOS QUE SOLO LE PERTENECEN A UN NEGOCIO EN ESPECIFICO*/
router.get('/getAllProductNegocio/:estado?', verificarTokenNegocio , ZapatosController.getAllProductNegocio);
/*BUSCAR POR ID*/
router.get('/searchproduct/:_id' , ZapatosController.searchproductId);
/*BUSCAR POR NOMBRE*/
router.get('/searchproductName/:nombre' ,verificarTokenNegocio, ZapatosController.searchproductName);
/*DEVUELVE LA CANTIDAD DE PRODUCTOS EXISTENTES*/
router.get('/countProduct' ,verificarTokenNegocio, ZapatosController.countProductNegocio);
/*ACTUALIZA LOS DATOS DEL PRODUCTO PO ID */
router.put('/update-data/:_id', verificarTokenNegocio , ZapatosController.updateData);
/*RECUPERA TODO LOS PRODUCTOS DE TODOS LOS NEGOCIOS */
router.get('/getAllZapatos', ZapatosController.getAllProduct);
/*BUSCA LOS PRODUCTOS POR MARCA */
router.get('/buscar-por-marca/:marca' , ZapatosController.buscarProductMarca);
/*BUSCA LOS PRODUCTOS POR GENERO DE LA PERSONA */
router.get('/search-shoes-sexo/:sexo', ZapatosController.searchProductSexo );
/*BUSCA LOS PRODUCTOS POR GENERO, TALLA , MARCA DEL PRODUCTO */
router.get('/search-shoes-sexo_talla_marca', ZapatosController.searchProductSexoTallaMarca );
/*ACTUALIZA EL ESTADO DEL PRODUCTO POR ID */
router.put('/update-status', verificarTokenNegocio , ZapatosController.updateStatus);
/*ACTUALIZA TODAS LAS MARCAS QUE SE ENCUENTRAN GUARDADOS */
router.put('/update-all-marca-shoes', verificarTokenNegocio , ZapatosController.updateAllMarca);
/*ELIMINA LOS DATOS DEL PRODUCTO POR ID */
router.delete('/delete-data/:_id', verificarTokenNegocio , ZapatosController.deleteData);

/*SUBIDA DE LA IMAGEN DEL PRODUCTO */
router.post('/upload-imagen/:_id',[verificarTokenNegocio ,upload.single('file') ] , ZapatosController.uploadImage);
/*OBTENER IMAGEN POR NOMBRE , ID DEL PRODUCTO =>QUERY , ID DE LA IMAGEN =>QUERY*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, ZapatosController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, ZapatosController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, ZapatosController.deleteAllImageProduct);
/*ACTUALIZAR IMAGEN  IDPRODUCTO , ID de la imagen*/
router.put('/updateImage',[ verificarTokenNegocio , upload.single('file') ] , ZapatosController.actualizarImage );
/*OBTENER IMAGEN POR NOMBRE*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, ZapatosController.getImage);
/*AUMENTA LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista' ,ZapatosController.aumentarVistas );
module.exports = router;