'use strict'
const Validator = require('validator');
const Negocio = require('../models/negocio');
var fs = require('fs');//PARA ELIMINAR ARCHIVOS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS

var controller = {

    save_update_data: (req, res) => {
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

        const body = req.body;
        const _idnegocio = req.negocio_autentificado._id;

        var result = saveUpdateData(_idnegocio, body);

        result.then(perfilInsert => {

            return res.status(200).send({
                status: "success",
                message: perfilInsert
            });

        }).catch(err => {

            return res.status(500).send({
                status: "error",
                message: err
            });

        });
    },

    get_data: (req, res) => {

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

        const _idNegocio = req.negocio_autentificado._id;

        Negocio.findOne({ _id: _idNegocio }).
            and({ estado: true }).
            select({ perfil: 1, _id: 1 }).
            exec((err, dataPerfil) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al buscar los productos"
                    });
                }

                if (!dataPerfil) {
                    return res.status(400).send({
                        status: "No encontrado",
                        message: "Perfil vacio"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: dataPerfil
                });

            });
    },

    delete_data: (req, res) => {
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

        var _id_negocio = req.negocio_autentificado._id;
        let resultRemoved = deletePerfil(_id_negocio);

        resultRemoved.then(perfilRevomed => {

            if (!perfilRevomed) {
                return res.status(404).send({
                    status: "Error",
                    message: "Error al eliminar el perfil"
                });
            }

            return res.status(200).send({
                status: "success",
                message: perfilRevomed
            });

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },
    uploadFileImg: (req, res) => {
        //SUBIDA DE IMAGENES
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

        const _idNegocio = req.negocio_autentificado._id;
        const messageImg = 'Imagen no subido';

        if (!req.file) {
            return res.status(404).send({
                status: 'vacio',
                message: messageImg
            });
        }

        var file_path = req.file.path;
        var file_split = file_path.split('\\');

        //Advertencia En linux o mac
        //var file_split = file_path.split(/);
        var file_name = file_split[2];

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
                        message: "La extension de la imagen no es válida"
                    });
                }
            });
        } else {

            //CONSULTAR SI EXISTE IMAGEN GUARDADO, PARA BORRAR LA IMAGEN DEL SERVIDOR
            Negocio.findOne({ _id: _idNegocio }).
                select({ "perfil.imagen": 1 }).
                exec((err, resultquery) => {

                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al buscar el negocio'
                        });
                    }
                    if (resultquery) {

                        if (resultquery.perfil.imagen != null) {
                            var rutaArchivo = './uploads/' + _idNegocio + '/' + resultquery.perfil.imagen;
                            fs.exists(rutaArchivo, (exists) => {

                                if (exists) {
                                    //BORRAR EL ARCHIVO SUBIDO ANTERIORMENTE
                                    fs.unlink(rutaArchivo, (err) => {
                                        if (err) {
                                            return res.status(500).send({
                                                status: 'error',
                                                message: "La extension de la imagen no es válida"
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });

            var result = agregarImagen(_idNegocio, file_name);

            result.then(producUp => {
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
        }
    },
    deleteImage: (req, res) => {
        const _idNegocio = req.negocio_autentificado._id;
        const imagenName = req.params.imageName;
        var rutaArchivo = './uploads/' + _idNegocio + '/' + imagenName;

        fs.exists(rutaArchivo, (exists) => {

            if (exists) {
                //BORRAR EL ARCHIVO SUBIDO ANTERIORMENTE
                fs.unlink(rutaArchivo, (err) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: "La extension de la imagen no es válida"
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        message: "Imagen eliminado"
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'vacio',
                    message: "La imagen no existe!!!"
                });
            }
        });
    },
    getImage: (req, res) => {
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
        var nameImage = req.params.nameImage;

        var path_file = './uploads/' + _idNegocio + '/' + nameImage;

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
    }
};

/**
 * ELIMINA LOS DATOS DEL PERFIL
 * @param {id del negocio que esta en sesion} _id_negocio 
 */
async function deletePerfil(_id_negocio) {

    let NegocioUpdate = await Negocio.findByIdAndUpdate(_id_negocio,
        {
            $set: {
                perfil: null
            }
        }, { new: true }
    );

    return NegocioUpdate;
}
/**
 * GUARDA O ACTUALIZA LOS DATOS DEL PERFIL
 * @param {id del negocio que esta en sesion} _idNegocio 
 * @param {Datos para guardar o actualizar} body 
 */
async function saveUpdateData(_idNegocio, body) {

    let perfilInsert = await Negocio.updateOne({ _id: _idNegocio }, {
        $set: {
            'perfil': {
                imagen: body.imagen,
                nombre_responsable: body.nombre_responsable,
                cedula_profesional: body.cedula_profesional,
                especializacion: body.especializacion
            }
        }
    }, { new: true });

    return perfilInsert;
}

async function agregarImagen(_idNegocio, rutaImage) {

    let productUpdate = await Negocio.updateOne({
        "_id": _idNegocio,
    }, {
        "$set":
            { "perfil.imagen": rutaImage }
    });

    return productUpdate;
}

module.exports = controller;