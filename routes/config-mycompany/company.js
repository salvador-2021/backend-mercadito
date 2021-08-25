'use strict'
const express = require('express');
const companyController = require('../../controllers/mycompany/config-company');
//FALTA AUNTENFICAR EL ADMINISTRADOR
const verificarTokenNegocio = require('../../middlewares/auth_negocio');

var router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination:function (req , file , cb){

            var rutaDestino = './uploadscompany';

            cb( null , rutaDestino );
         
        },

        filename: function(req, file, cb){
            cb(null,Date.now()+"_"+file.originalname);
        }
    }
);

const upload = multer( { storage: storage } );

//Rutas
router.post('/save-data' , companyController.saveData);
router.get('/get-img/:nameImage' , companyController.getImage);
router.get('/getListNameImage' , companyController.getListNameImage);
router.put('/update-data' , companyController.updateData);

module.exports = router;