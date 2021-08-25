'use strict'
const mongoose = require('mongoose');
const Validator = require('validator');
const mycompany = require('../../models/mycompany');
var fs = require('fs');//PARA ELIMINAR ARCHIVOS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS

var controller = {

    saveData: (req, res) => {
        console.log("guardar", req.body);
        
        const _idproducto = new mongoose.Types.ObjectId();
        
        var resultInsert = guardarDatos( _idproducto , req.body);

        resultInsert.then(dataUpdate => {

            if (!dataUpdate) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Lista vacio"
                });
            }

            return res.status(200).send({
                status: "success",
                message: _idproducto
            });

        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },

    updateData: (req, res) => {
        var _idDocument = req.params._id;
        let resultUpdate = actualizarDatos(_idDocument);

        resultUpdate.then(dataUpdate => {
            
            if (!dataUpdate) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Lista vacio"
                });
            }

            return res.status(200).send({
                status: "success",
                message: dataUpdate
            });

        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },

    getListNameImage: (req, res) => {
        mycompany.findOne({}).select({ img_linea_negocio: 1 }).exec((error, resultquery) => {
            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al buscar la imagen'
                });
            }

            if (!resultquery) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            return res.status(200).send({
                status: "success",
                message: resultquery
            });

        });
    },
    uploadImage: (req, res) => {
        //SUBIDA DE IMAGENES

        var file_name = 'Imagen no subido';

        if (!req.file) {
            return res.status(404).send({
                status: 'vacio',
                message: file_name
            });
        }

        var file_path = req.file.path;

        var file_split = file_path.split('\\');

        //Advertencia En linux o mac
        //var file_split = file_path.split(/);
        var file_name = file_split[3];

        //EXTENSIÓN DEL ARCHIVO
        var ext_split = file_name.split('.');

        var file_ext = ext_split[1];

        //COMPROBAR EXTENSION (SOLO IMAGENES), SI ES VALIDA BORRAR EL FICHERO
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg') {
            //BORRAR EL ARCHIVO SUBIDO
            fs.unlink(file_path, (err) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "La extension de la imagen no es válida " + err
                    });
                }
            });

        } else {
            if (req.body._idDocument) {

                var _idDocument = req.body._idDocument;
                var _idImage = req.params._id;
                var result = agregarImagen(_idDocument, _idImage, file_name);

                result.then(producUp => {

                    if (!producUp) {
                        return res.status(200).send({
                            status: "vacio",
                            message: "Producto no encontrado"
                        });
                    }

                    return res.status(200).send({
                        status: "success",
                        message: producUp
                    });

                }).catch(err => {
                    return res.status(500).send({
                        status: "error",
                        message: err
                    });
                });

            } else {
                return res.status(200).send({
                    status: "success",
                    message: file_name
                }); s
            }
        }
    },
    getImage: (req, res) => {

        var nameImage = req.params.nameImage;
        var path_file = './uploads-company/' + nameImage;

        fs.exists(path_file, (exists) => {

            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe!!'
                });
            }
        });
    },
    deleteImageProduct: (req, res) => {

        const _nameImage = req.params.nameImage;

        //RUTA DEL ARCHIVO A ELIMINAR
        const rutaArchivoEliminar = './uploads-company/'+ _nameImage;

        fs.exists(rutaArchivoEliminar, (exists) => {

            if (exists) {
                fs.unlink(rutaArchivoEliminar, (err) => {

                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: "Error al eliminar el archivo"
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        message: "Archivo eliminado correctamente"
                    });
                });

            } else {
                return res.status(404).send({
                    status: 'error',
                    message: "No existe el archivo"
                });
            }
        });
    },
};

async function guardarDatos(_idproducto , body) {
    let NegocioInsert = new mycompany({
        _id:_idproducto,
        cantidad_img_abarrote: body.cantidad_img_abarrote,
        cantidad_img_ropa: body.cantidad_img_ropa,
        cantidad_img_calzado: body.cantidad_img_calzado
    });
    return await NegocioInsert.save();
}

async function agregarImagen(_idNegocio, _idProducto, rutaImage) {

    let productUpdate = await Negocio.updateOne({
        "_id": _idNegocio,
        "img_linea_negocio._id": _idProducto
    }, {
        "$push":
            { "img_linea_negocio": { "ruta": rutaImage } }
    });

    return productUpdate;
}

async function actualizarDatos(_id ) {
    //img_linea_negocio: [{ "ruta": "abarrote.jpg" }],
    var NegocioUpdate = await mycompany.findByIdAndUpdate(_id,
        {
            $set: {
                cantidad_img_abarrote: 5,
                cantidad_img_ropa: 5,
                cantidad_img_calzado: 5,
            }
        }, { new: true }
    );

    return NegocioUpdate;
}

module.exports = controller;