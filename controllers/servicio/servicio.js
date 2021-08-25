'use strict'
const mongoose = require('mongoose');
const Validator = require('validator');
const Negocio = require('../../models/negocio');
var fs = require('fs');//PARA ELIMINAR ARCHIVOS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS

var controller = {

    save_servicio: (req, res) => {
        /*GUARDADO DE LOS DATOS DEL SERVICIO */
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
                message: "Usuario no identificadod " + error
            });
        }

        //DATOS QUE VIENEN POR POST
        var body = req.body;
        var _idNegocio = req.negocio_autentificado._id;

        const _idproducto = new mongoose.Types.ObjectId();
        var datos_servicio = {
            _id: _idproducto,
            tipo_servicio: body.tipo_servicio,
            nombre: body.nombre,
            descripcion: body.descripcion,
            precio: body.precio,
            precio_anterior: body.precio_anterior,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin
        };

        var result = agregarServicio(_idNegocio, datos_servicio);

        result.then(producUp => {

            return res.status(200).send({
                status: "success",
                message: _idproducto
            });

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });

    }, //FIN DEL METODO GUARDAR ==================================
    getAllServicioNegocio: (req, res) => {
        /* RECUPERACION DE TODOS LOS PRODUCTOS QUE SOLO LE PERTENECEN A UN NEGOCIO EN
           ESPECIFICO*/
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
        var estadoProducto = req.params.estado;

        var listaServicioEncontrados = [];

        Negocio.find({ _id: _idNegocio }).
            and({ estado: true }).
            select({ servicios: 1, _id: 1 }).
            exec((err, listService) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Servicio no encontrado"
                    });
                }

                listService.forEach((servicios, index, data) => {

                    console.log(servicios);
                    servicios['servicios'].forEach((servicio, index, data) => {

                        let estado_recuperado = servicio['estado'];

                        //PRODUCTO ACTIVADO
                        if (estado_recuperado == estadoProducto) {
                            listaServicioEncontrados.push(servicio);
                        }
                    }
                    );
                });

                if (listaServicioEncontrados.length == 0) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                //ORDENAMIENTO DE DATOS POR PRECIO MENOR A MAYOR
                listaServicioEncontrados.sort((a, b) => {
                    var textA = a.precio;
                    var textB = b.precio;
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                return res.status(200).send({
                    status: "success",
                    message: listaServicioEncontrados
                });
            });

    },
    getAllServicio: (req, res) => {

        Negocio.find().
            and([{ estado: true }, { "servicios.estado": true }]).
            select({ servicios: 1, _id: 1 }).
            sort({ "servicios.precio": 1 }).
            exec((error, listServicios) => {

                if (error) {
                    return res.status(500).send({
                        status: "error",
                        message: "Servicio no encontrado " + error
                    });
                }

                if (listServicios.length == 0) {
                    return res.status(404).send({
                        status: "No encontrado",
                        message: "Servicio no encontrado"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: listServicios
                });
            });
    },
    searchproductId: (req, res) => {
        if (req.params._id) { //BUSQUEDAD POR ID
            //FUNCIONA

            Negocio.findOne({ "servicios._id": req.params._id }, { "servicios.$": 1 }).exec((err, listService) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado " + err
                    });
                }

                if (listService.length == 0) {
                    return res.status(404).send({
                        status: "No encontrado",
                        message: "Producto no encontrado"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: listService
                });
            });
        }
    },
    searchproductName: (req, res) => {

        var queryMongo;
        var nombrebody = req.params.nombre;
        var _idNegocio = req.negocio_autentificado._id;

        queryMongo = Negocio.find({
            _id: _idNegocio,
            "$or": [
                { "servicios.nombre": { "$regex": nombrebody, "$options": "i" } },
                { "servicios.descripcion": { "$regex": nombrebody, "$options": "i" } }
            ]
        });

        var listaServicioEncontrados = [];
        queryMongo.
            and([{ estado: true }, { "servicios.estado": true }]).
            select({ servicios: 1, _id: 1 }).
            sort({ "servicios.precio": 1 }).
            exec((err, serviciosEncon) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if (serviciosEncon.length == 0) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Servicio no encontrado"
                    });
                }

                serviciosEncon.forEach((service, index, data) => {

                    service['servicios'].forEach((servicio, index, data) => {

                        let er = new RegExp(nombrebody, 'i')
                        if (er.test(servicio.nombre)) {
                            listaServicioEncontrados.push(servicio);
                        }
                    });
                }
                );

                return res.status(200).send({
                    status: "success",
                    message: listaServicioEncontrados
                });

            });
    },
    countProductNegocio: (req, res) => {

        var queryMongo;
        var _idNegocio = req.negocio_autentificado._id;

        queryMongo = Negocio.find({ _id: _idNegocio });

        queryMongo.
            select({ servicios: 1 }).
            and([{ estado: true }]).
            exec((err, findServices) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if (findServices[0].servicios.length == 0 || findServices[0].servicios.length == null) {
                    return res.status(200).send({
                        status: "success",
                        message: 0
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: findServices[0].servicios.length
                });

            });
    },
    searchServicioTipo: (req, res) => {

        var tipoServiciobody = req.body.tipo_servicio;

        Negocio.find({ "servicios.tipo_servicio": { "$regex": tipoServiciobody, "$options": "i" } }).
            and([{ estado: true }, { "servicios.estado": true }]).
            select({ servicios: 1, _id: 1 }).
            sort({ "servicios.precio": 1 }).
            exec((err, listServicio) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if (listServicio.length == 0) {
                    return res.status(404).send({
                        status: "No encontrado",
                        message: "Producto no encontrado"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: listServicio
                });

            });
    },
    updateDatos: (req, res) => {
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
        //ACTUALIZACION DEL PRODUCTO POR ID DEL NEGOCIO AL QUE PERTENECE Y SU PROPIO ID
        var _id_negocio = req.negocio_autentificado._id;
        //RECOGEMOS DATOS POR POST
        var _id_servicio = req.params._id;
        var body = req.body;

        var datos_servicio = {
            _id:body._id,
            tipo_servicio: body.tipo_servicio,
            nombre: body.nombre,
            descripcion: body.descripcion,
            precio: body.precio,
            precio_anterior: body.precio_anterior,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin
        };

        let resultUpdate = actualizarServicio(_id_negocio, _id_servicio, datos_servicio);

        resultUpdate.then(productUpdate => {
            if (!productUpdate) {
                return res.status(400).send({
                    status: "error",
                    message: "Error al actualizar el producto"
                });
            }

            return res.status(200).send({
                status: "success",
                message: productUpdate
            });

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },
    deleteServicio: (req, res) => {
        //ELIMINACION DEL PRODUCTO POR ID DEL NEGOCIO AL QUE PERTENECE Y SU PROPIO ID
        var _id_negocio = req.negocio_autentificado._id;
        //RECOGEN DATOS POR POST
        var _id_servicio = req.params._id;

        let resultRemoved = eliminarServicio(_id_negocio, _id_servicio);

        resultRemoved.then(productRevomed => {
            if (!productRevomed) {
                return res.status(404).send({
                    status: "error",
                    message: "Error al eliminar el servicio"
                });
            }

            return res.status(200).send({
                status: "success",
                message: productRevomed
            });

        }).catch(err => {
            return res.status(500).send({
                status: "Error",
                message: err
            });
        });
    },
    updateAllTipoServicio: (req, res) => {
        //ACTUALIZACION DE LAS LINEAS DE TODOS LOS PRODUCTO SEGUN UNA LINEA EN ESPECIFICO
        //INDICANDO LA LINEA ANTIGUA Y LINEA NUEVA

        const body = req.body;
        const t_serviceOld = body.t_serviceOld;
        const t_serviceNew = body.t_serviceNew;

        var resultUpdate = updateTipoServicioAllProduct(t_serviceOld.toUpperCase(), t_serviceNew.toUpperCase());

        resultUpdate.then(tipoUpdate => {
            if (!tipoUpdate) {
                return res.status(404).send({
                    status: "Error",
                    message: "Error al actualizar el tipo service"
                });
            }

            return res.status(200).send({
                status: "success",
                message: tipoUpdate
            });

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });

    },
    updateStatus: (req, res) => {

        const _id_negocio = req.negocio_autentificado._id;
        const _id_servicio = req.body._id;
        const estado = req.body.estado;

        let resultUpdate = updateStatus_servicio(_id_negocio, _id_servicio, estado);

        resultUpdate.then(servicioUpdate => {

            if (!servicioUpdate) {
                return res.status(404).send({
                    status: "error",
                    message: "Error al actualizar el servicio"
                });
            }

            return res.status(200).send({
                status: "Success",
                message: servicioUpdate
            });

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },
    actualizarImage: (req, res) => {
        //ACTUALIZACION DE IMAGEN
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
        var file_name = 'Imagen no subido';

        if (!req.file) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        var file_path = req.file.path;

        var file_split = file_path.split('\\');

        //Advertencia En linux o mac
        //var file_split = file_path.split(/);
        var file_name = file_split[3];
        //console.log('file_name: ' + file_name);

        //EXTENSIÓN DEL ARCHIVO
        var ext_split = file_name.split('.');
        //console.log('ext_split ' + ext_split);

        var file_ext = ext_split[1];
        //console.log('file_ext ' + file_ext);

        //COMPROBAR EXTENSION (SOLO IMAGENES), SI ES VALIDA BORRAR EL FICHERO
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg') {
            //BORRAR EL ARCHIVO SUBIDO
            let rutaArchivoEliminar = './uploads/' + _idNegocio + '/servicio/' + file_name;

            fs.exists(rutaArchivoEliminar, (exists) => {

                if (exists) {

                    fs.unlink(rutaArchivoEliminar, (err) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: "La extension de la imagen no es válida"
                            });
                        }
                    });

                } else {
                    return res.status(404).send({
                        status: 'error',
                        message: "La extension de la imagen no es válida"
                    });
                }
            });

        } else {

            var _idProducto = req.query._idProducto;
            var _idImage = req.query._idImage;

            Negocio.findOne(
                { "_id": _idNegocio },
                { "servicios._id": _idProducto },
                { 'servicios.imagen._id': _idImage }).
                select({ 'servicios.imagen': 1 }).
                exec((err, resultquery) => {

                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al buscar la imagen'
                        });
                    }

                    if (resultquery) {

                        resultquery["servicios"].forEach((lista_image, index, data) => {

                            lista_image["imagen"].forEach((datos, index, data) => {

                                if (datos['_id'] == _idImage) {

                                    //ELIMINACION DEL ARCHIVO SUBIDO ANTERIORMENTE
                                    var rutaArchivo = './uploads/' + _idNegocio + '/servicio/' + datos['ruta'];

                                    fs.exists(rutaArchivo, (exists) => {

                                        if (exists) {
                                            //BORRAR EL ARCHIVO SUBIDO
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
                            });
                        });
                    }
                });


            let resultUpdate = actualizarImagen(_idNegocio, _idProducto, _idImage, file_name);

            resultUpdate.then(productUpdate => {

                if (!productUpdate) {
                    return res.status(404).send({
                        status: "error",
                        message: "Error al actualizar el producto"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: productUpdate
                });

            }).catch(err => {
                return res.status(500).send({
                    status: "error",
                    message: err
                });
            });
        }
    },

    uploadImage: (req, res) => {
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
        console.log("Subida de imagen en servicio....");
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
            if (req.params._id) {
                
                var _idNegocio = req.negocio_autentificado._id;
                var _idServicio = req.params._id;
                var result = agregarImagen(_idNegocio, _idServicio, file_name);

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

            } else {
                return res.status(200).send({
                    status: "success",
                    message: file_name
                }); s
            }
        }
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
        var path_file = './uploads/' + _idNegocio + '/servicios/' + nameImage;

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
        //AUTENTIFICAR USUARIO
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
        const _nameImage = req.params.nameImage;

        //RUTA DEL ARCHIVO A ELIMINAR
        const rutaArchivoEliminar = './uploads/' + _idNegocio + '/servicio/' + _nameImage;

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

    deleteAllImageProduct: (req, res) => {

        const _idnegocio = req.negocio_autentificado._id;
        const rutaArchivoEliminar = '../../uploads/' + _idnegocio + '/servicios';

        //SE ELIMINA LAS IMAGENES
        let pathJoin = path.join(__dirname, rutaArchivoEliminar);

        eliminarFolderNegocio(pathJoin).then(respuestaEliminacion => {

            if (respuestaEliminacion == "DIRECTORIO_ELIMINADO") {
                console.log(respuestaEliminacion);
            } else {
                return res.status(500).send(
                    {
                        status: "error",
                        message: "Hubo un problema con el servidor"
                    }
                );
            }
        });

        //SE ELIMINA LA LISTA DE DATOS EN EN ARRAY
        let resultUpdate = borrarListaProducto(_idnegocio);
        resultUpdate.then(productUpdate => {
            if (!productUpdate) {
                return res.status(404).send({
                    status: "error",
                    message: "Error al actualizar el producto"
                });
            }

            return res.status(200).send({
                status: "success",
                message: productUpdate
            });

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },
    aumentarVistas: (req, res) => {

        let _idNegocio = req.query._idnegocio;
        let _idproducto = req.query._idproducto

        let update = incrementarVista(_idNegocio, _idproducto);
        update.then(updateVist => {

            return res.status(200).send({
                status: "success",
                message: updateVist
            });

        }).catch(error => {

            return res.status(500).send({
                status: "error",
                message: error
            });
        });
    }
};

/**
 * ELIMINA UN PRODUCTO QUE PERTENECE A LA COLECCION DE NEGOCIO
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} _id_servicio _id DEL PRODUCTO
 */
async function eliminarServicio(_id_negocio, _id_servicio) {

    let servicioRemoved = await Negocio.update({ '_id': _id_negocio },
        {
            $pull: {
                servicios: { _id: { $eq: _id_servicio } }
            }
        }
    );
    return servicioRemoved;
}

/**
 * CUANDO SE ACTUALICE ALGUNA LINEA DE LA COLECCION linea_productos
 * SE LLAMARA ESTE METODO PARA ACTUALIZAR LA LINEA DE LOS PRODUCTOS EXISTENTE
 * POR LA LINEA QUE SE DESEA ACTUALIZAR
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} tipoOld LINEA ACTUAL
 * @param {*} tipoNew LINEA NUEVA POR ACTUALIZAR
 */
async function updateTipoServicioAllProduct(tipoOld, tipoNew) {

    let productUpdate = await Negocio.updateMany({},
        {
            $set: {
                'servicios.$[tipo].tipo_servicio': tipoNew
            }
        },
        {
            arrayFilters: [{ "tipo.tipo_servicio": { $eq: tipoOld } }]
        }
    );

    return productUpdate;
}

/**
 * ACTUALIZAR EL ESTADO DEL PRODUCTO A TRUE O FALSE
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} _id_servicio _id DEL PRODUCTO
 * @param {*} status ESTADO FALSE O TRUE
 */
async function updateStatus_servicio(_id_negocio, _id_servicio, status) {


    let servicioUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $set: {
                'servicios.$[serv].estado': status
            }
        },
        {
            arrayFilters: [{ "serv._id": { $eq: _id_servicio } }]
        });

    return servicioUpdate;
}

/**
 * ACTUALIZA LOS DATOS DEL PRODUCTO 
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} _id_servicio _id DEL PRODUCTO
 * @param {*} datos_servicio DATOS DEL PRODUCTO EN JSON
 */
async function actualizarServicio(_id_negocio, _id_servicio, datos_servicio) {

    let serviceUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $set: {
                'servicios.$[prod]': datos_servicio
            }
        },
        {
            arrayFilters: [{ "prod._id": { $eq: _id_servicio } }]
        });

    return serviceUpdate;
}

/**
 * GUARDA UN PRODUCTO EN LA COLECCION DE NEGOCIO DENTRO DE UN ARRAY
 * @param {*} _idNegocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} datos_servicio DATOS DEL PRODUCTO EN JSON
 */
async function agregarServicio(_idNegocio, datos_servicio) {

    let servicioInsert = await Negocio.updateOne({ _id: _idNegocio }, {
        $push: {
            'servicios': datos_servicio
        }
    }, { new: true });

    return servicioInsert;
}


async function agregarImagen(_idNegocio, _idProducto, rutaImage) {

    let productUpdate = await Negocio.updateOne({
        "_id": _idNegocio,
        "servicios._id": _idProducto
    }, {
        "$push":
            { "servicios.$.imagen": { "ruta": rutaImage } }
    });

    return productUpdate;
}

async function actualizarImagen(_idNegocio, _idProducto, _id_image, rutaImage) {
    let productUpdate = await Negocio.updateOne(
        { "_id": { $eq: _idNegocio } },
        { $set: { "servicios.$[prod].imagen.$[img].ruta": rutaImage } },
        {
            arrayFilters: [
                { "prod._id": { $eq: _idProducto } },
                { "img._id": { $eq: _id_image } }
            ]
        });

    return productUpdate;
}

async function incrementarVista(_id_negocio, _id_producto) {

    let productUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $inc: {
                'servicios.$[prod].vistas': 1
            }
        },
        {
            arrayFilters: [{ "prod._id": { $eq: _id_producto } }]
        });

    return productUpdate;
}

//================================================================================
function deleteFolder(path) {
    //SE CREA UNA PROMESA
    return new Promise(resolve => {
        //SE RESUELVE EL PROBLEMA
        let files = [];
        if (fs.existsSync(path)) {

            files = fs.readdirSync(path);
            files.forEach(function (file, index) {

                let curPath = path + "/" + file;

                fs.unlinkSync(curPath);
            });
            
            resolve("DIRECTORIO_ELIMINADO");
        } else {
            //DEVOLVEMOS UNA RESPUESTA
            resolve("EL_DIRECTORIO_NO_EXISTE");
        }
    });
}

//CREAMOS UNA FUNCION ASINCRONA
async function eliminarFolderNegocio(path) {
    //USAMOS LA FUNCION 
    const respuesta = await deleteFolder(path);
    return respuesta;
}

/**
 * ACTUALIZAMOS EL ARRAY A UNA MATRIZ VACIO
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 */
async function borrarListaProducto(_id_negocio) {

    let productUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $set: {
                'servicios': []
            }
        }
    );

    return productUpdate;
}

module.exports = controller;