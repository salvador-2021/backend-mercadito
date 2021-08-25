'use strict'
const express = require('express');
const companyController = require('../../controllers/mycompany/img-linea-negocio');
//FALTA AUNTENFICAR EL ADMINISTRADOR
const verificarTokenNegocio = require('../../middlewares/auth_negocio');

var router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {

            var rutaDestino = './uploads-company';

            cb(null, rutaDestino);

        },

        filename: function (req, file, cb) {
            cb(null, Date.now() + "_" + file.originalname);
        }
    }
);

const upload = multer({ storage: storage });

//Rutas
router.post('/save-data', companyController.saveData);
router.get('/get-data/:_id', companyController.getData);
router.get('/get-img/:nameImage', companyController.getImage);
router.get('/getListNameImage', companyController.getListNameImage);
router.put('/update-data/:_id', companyController.updateData);
router.delete('/delete-data/:_id', companyController.deleteData);
/*SUBIDA DE LA IMAGEN DEL PRODUCTO*/
router.post('/upload-imagen/:_id', [upload.single('file')], companyController.uploadImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage', companyController.deleteImageProduct);

module.exports = router;