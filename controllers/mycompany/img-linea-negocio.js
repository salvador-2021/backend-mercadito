'use strict'
const mongoose = require('mongoose');
const Validator = require('validator');
const imgLineaNegocio = require('../../models/img-linea-negocio');
var fs = require('fs');//PARA ELIMINAR ARCHIVOS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS

var controller = {

    saveData: (req, res) => {

        const _idproducto = new mongoose.Types.ObjectId();
        var resultInsert = guardarDatos(_idproducto, req.body);

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

    getData: (req, res) => {
        var _idDocument = req.params._id;
        imgLineaNegocio.findOne({ _id: _idDocument }).exec((error, resultQuery) => {
            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al buscar la imagen'
                });
            }

            if (!resultQuery) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            return res.status(200).send({
                status: "success",
                message: resultQuery
            });
        });
    },

    updateData: (req, res) => {
        var _idDocument = req.params._id;
        var body = req.body;
        let resultUpdate = actualizarDatos(_idDocument, body);

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
    deleteData:(req , res)=>{

        imgLineaNegocio.findByIdAndDelete({_id:req.params._id}).exec((error , resultquery) =>{
            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al buscar la imagen'
                });
            }
            if (!resultquery) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Lista vacio"
                });
            }
            return res.status(200).send({
                status: "success",
                message: "Registro eliminado"
            });
        });
    },
    getListNameImage: (req, res) => {
        imgLineaNegocio.find({}).exec((error, resultquery) => {
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

    searchproductName: (req, res) => {

        var queryMongo;
        var _id = req.params._id;
        var nombrebody = req.body.nombre;

        queryMongo = imgLineaNegocio.find({
            "_id": _id,
            "$or": [
                { "title": { "$regex": nombrebody, "$options": "i" } },
                { "description": { "$regex": nombrebody, "$options": "i" } }
            ]
        });

        var listaProductoEncontrados = [];
        queryMongo.exec((err, abarrotes) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if (!abarrotes) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                if (abarrotes.length == 0) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                abarrotes.forEach((abarrote, index, data) => {

                    abarrote['abarrote'].forEach((producto, index, data) => {

                        let er = new RegExp(nombrebody, 'i')
                        if (er.test(producto.nombre)) {
                            listaProductoEncontrados.push(producto);
                        }
                    });
                }
                );

                return res.status(200).send({
                    status: "success",
                    message: listaProductoEncontrados
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
        var file_name = file_split[1];

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
            let _idDocument = req.params._id;
            let resultUpdate = agregarImage(_idDocument, file_name);

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
        const rutaArchivoEliminar = './uploads-company/' + _nameImage;

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

async function guardarDatos(_idproducto, body) {
    let NegocioInsert = new imgLineaNegocio({
        _id: _idproducto,
        ruta: body.ruta,
        title: body.title,
        description: body.description
    });
    return await NegocioInsert.save();
}

async function actualizarDatos(_idDocument, body) {

    let documentUpdate = await imgLineaNegocio.findByIdAndUpdate(_idDocument,
        {
            $set: {
                ruta: body.ruta,
                title: body.title,
                description: body.description
            }
        }, { new: true });

    return documentUpdate;
}
async function agregarImage(_idDocument, nameImage) {

    let documentUpdate = await imgLineaNegocio.findByIdAndUpdate(_idDocument,
        {
            $set: {
                ruta: nameImage,
            }
        }, { new: true });

    return documentUpdate;
}

module.exports = controller;