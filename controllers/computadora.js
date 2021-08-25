'use strict'
const mongoose = require('mongoose');
const Validator = require('validator');
const Negocio = require('../models/negocio');
var fs = require('fs');//PARA ELIMINAR ARCHIVOS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS

var controller = {

    save_data: (req, res) => {
        //DATOS QUE VIENEN POR POST
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
        var body = req.body;

        const _idproducto = new mongoose.Types.ObjectId();
        var datos_computadora = {
            _id: _idproducto,
            nombre: body.nombre,
            descripcionPantalla: body.descripcionPantalla,
            descripcionSO: body.descripcionSO,
            descripcionAlmacenamiento: body.descripcionAlmacenamiento,
            descripcionMemoriaRam: body.descripcionMemoriaRam,
            MemoriaRamExpandible: body.MemoriaRamExpandible,
            DescripcionGPU: body.DescripcionGPU,
            sistemaEnfriamiento: body.sistemaEnfriamiento,
            tecnologiaDesbloqueo: body.tecnologiaDesbloqueo,
            tecnologiaAudio: body.tecnologiaAudio,
            color: body.color,
            marca: body.marca,
            grosor: body.grosor,
            peso: body.peso,
            cpu: body.cpu,
            marcaCPU: body.marcaCPU,
            modeloCPU: body.modeloCPU,
            generacionCPU: body.generacionCPU,
            velocidadCPU: body.velocidadCPU,
            almacenamientoEmmc: body.almacenamientoEmmc,
            tipoTeclado: body.tipoTeclado,
            resolucion: body.resolucion,
            camaraWeb: body.camaraWeb,
            lectorDisco: body.lectorDisco,
            microfono: body.microfono,
            cargador: body.cargador,
            entradaHdmi: body.entradaHdmi,
            puertosUsb: body.puertosUsb,
            puertoEthernet: body.puertoEthernet,
            tarjetaEthernet: body.tarjetaEthernet,
            bluetooth: body.bluetooth,
            duracionBateria: body.duracionBateria,
            tipoBateria: body.tipoBateria,
            medidas: body.medidas,
            unidadventa: body.unidadventa,
            garantia: body.garantia,
            otra_inf: body.otra_inf,
            existencia: body.existencia,
            precio: body.precio,
            precio_anterior: body.precio_anterior,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin
        };

        var result = agregaProduct(_idNegocio, datos_computadora);

        result.then(producUp => {

            if (!producUp) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
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

    }, //FIN DEL METODO GUARDAR ==================================

    getAllProductNegocio: (req, res) => {
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

        //DATOS QUE VIENEN POR POST
        var _idNegocio = req.negocio_autentificado._id;
        var estadoProducto = req.params.estado;

        var listaProductoEncontrados = [];

        Negocio.find({ _id: _idNegocio }).
            and({ estado: true }).
            select({ computadora: 1, _id: 1 }).
            exec((err, listProducto) => {

                if (err) {
                    return res.status(200).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if (!listProducto) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                listProducto.forEach((productos, index, data) => {

                    productos['computadora'].forEach((producto, index, data) => {

                        let estado_recuperado = producto['estado'];

                        //PRODUCTO ACTIVADO
                        if (estado_recuperado == estadoProducto) {
                            listaProductoEncontrados.push(producto);
                        }
                    }
                    );
                });

                if (listaProductoEncontrados.length == 0) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                //ORDENAMIENTO DE DATOS POR PRECIO MENOR A MAYOR
                listaProductoEncontrados.sort((a, b) => {
                    var textA = a.precio;
                    var textB = b.precio;
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                return res.status(200).send({
                    status: "success",
                    message: listaProductoEncontrados
                });

            });
    },

    getAllProducto: (req, res) => {

        Negocio.find().
            and([{ estado: true }, { "computadora.estado": true }]).
            select({ ropas: 1, _id: 1 }).
            sort({ "computadora.precio": 1 }).
            exec((err, listProducto) => {

                if (err) {
                    return res.status(200).send({
                        status: "Error",
                        message: "Producto no encontrado"
                    });
                }

                if (!listProducto) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(200).send({
                        status: "No encontrado",
                        message: "Producto no encontrado"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: listProducto

                });

            });
    },

    searchproductId: (req, res) => {

        if (req.params._id) { //BUSQUEDAD POR ID
            //FUNCIONA

            Negocio.findOne({ "computadora._id": req.params._id }, { "computadora.$": 1 }).exec((err, listProducto) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado " + err
                    });
                }

                if (!listProducto) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(404).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: listProducto
                });
            });
        }
    },
    countProductNegocio: (req, res) => {

        var queryMongo;
        var _idNegocio = req.negocio_autentificado._id;

        queryMongo = Negocio.find({ _id: _idNegocio });

        queryMongo.
            select({ computadora: 1 }).
            and([{ estado: true }]).
            exec((err, lista) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if (!lista) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                if (lista[0].computadora.length == 0 || lista[0].computadora.length == null) {
                    return res.status(200).send({
                        status: "success",
                        message: 0
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: lista[0].computadora.length
                });

            });
    },
    updateData: (req, res) => {
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
        //RECOGEMOS DATOS POR POST
        var _id_producto = req.params._id;

        var body = req.body;

        var datos_computadora = {
            _id: body._id,
            imagen: body.imagen,
            nombre: body.nombre,
            descripcionPantalla: body.descripcionPantalla,
            descripcionSO: body.descripcionSO,
            descripcionAlmacenamiento: body.descripcionAlmacenamiento,
            descripcionMemoriaRam: body.descripcionMemoriaRam,
            MemoriaRamExpandible: body.MemoriaRamExpandible,
            DescripcionGPU: body.DescripcionGPU,
            sistemaEnfriamiento: body.sistemaEnfriamiento,
            tecnologiaDesbloqueo: body.tecnologiaDesbloqueo,
            tecnologiaAudio: body.tecnologiaAudio,
            color: body.color,
            marca: body.marca,
            grosor: body.grosor,
            peso: body.peso,
            cpu: body.cpu,
            marcaCPU: body.marcaCPU,
            modeloCPU: body.modeloCPU,
            generacionCPU: body.generacionCPU,
            velocidadCPU: body.velocidadCPU,
            almacenamientoEmmc: body.almacenamientoEmmc,
            tipoTeclado: body.tipoTeclado,
            resolucion: body.resolucion,
            camaraWeb: body.camaraWeb,
            lectorDisco: body.lectorDisco,
            microfono: body.microfono,
            cargador: body.cargador,
            entradaHdmi: body.entradaHdmi,
            puertosUsb: body.puertosUsb,
            puertoEthernet: body.puertoEthernet,
            tarjetaEthernet: body.tarjetaEthernet,
            bluetooth: body.bluetooth,
            duracionBateria: body.duracionBateria,
            tipoBateria: body.tipoBateria,
            medidas: body.medidas,
            unidadventa: body.unidadventa,
            garantia: body.garantia,
            otra_inf: body.otra_inf,
            existencia: body.existencia,
            precio: body.precio,
            precio_anterior: body.precio_anterior,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin
        };


        let resultUpdate = actualizarProduct(_id_negocio, _id_producto, datos_computadora);

        resultUpdate.then(productUpdate => {

            if (!productUpdate) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
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

    deleteData: (req, res) => {
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

        //ELIMINACION DEL PRODUCTO POR ID DEL NEGOCIO AL QUE PERTENECE Y SU PROPIO ID
        var _id_negocio = req.negocio_autentificado._id;
        //RECOGEN DATOS POR POST
        var _idProduct = req.params._id;

        let resultRemoved = eliminarProduct(_id_negocio, _idProduct);

        resultRemoved.then(productRevomed => {

            if (!productRevomed) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            return res.status(200).send({
                status: "success",
                message: productRevomed
            });
        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },
    updateStatusProduct: (req, res) => {
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

        var _id_negocio = req.negocio_autentificado._id;
        
        var _id_producto = req.body._id;
        var estado = req.body.estado;


        let resultUpdate = updateStatusProduct(_id_negocio, _id_producto, estado);
        resultUpdate.then(productUpdate => {

            if(!productUpdate){
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
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
    actualizarImage: (req, res) => {
        //ACTUALIZACION DE IMAGEN
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
            let rutaArchivoEliminar = './uploads/' + _idNegocio + '/computadora/' + file_name;

            fs.exists(rutaArchivoEliminar, (exists) => {

                if (exists) {

                    fs.unlink(rutaArchivoEliminar, (err) => {
                        if (err) {
                            return res.status(200).send({
                                status: 'error',
                                message: "La extension de la imagen no es válida"
                            });
                        }
                    });

                } else {
                    return res.status(200).send({
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
                { "computadora._id": _idProducto },
                { 'computadora.imagen._id': _idImage }).
                select({ 'computadora.imagen': 1 }).
                exec((err, resultquery) => {

                    if (err) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Error al buscar el negocio'
                        });
                    }

                    if(!resultquery){
                        return res.status(200).send({
                            status: "vacio",
                            message: "Producto no encontrado"
                        });
                    }

                    if (resultquery) {

                        resultquery["computadora"].forEach((lista_image, index, data) => {

                            lista_image["imagen"].forEach((datos, index, data) => {

                                if (datos['_id'] == _idImage) {

                                    //ELIMINACION DEL ARCHIVO SUBIDO ANTERIORMENTE
                                    var rutaArchivo = './uploads/' + _idNegocio + '/computadora/' + datos['ruta'];

                                    fs.exists(rutaArchivo, (exists) => {

                                        if (exists) {
                                            //BORRAR EL ARCHIVO SUBIDO
                                            fs.unlink(rutaArchivo, (err) => {

                                                if (err) {
                                                    return res.status(200).send({
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

                if(!productUpdate){
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
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
                var _idProducto = req.params._id;
                var result = agregarImagen(_idNegocio, _idProducto, file_name);

                result.then(producUp => {

                    if(!producUp){
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
        var path_file = './uploads/' + _idNegocio + '/computadora/' + nameImage;

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

        console.log("name imagen", _nameImage);

        //RUTA DEL ARCHIVO A ELIMINAR
        const rutaArchivoEliminar = './uploads/' + _idNegocio + '/computadora/' + _nameImage;

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
        const rutaArchivoEliminar = '../../uploads/' + _idnegocio + '/computadora';

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

            if(!updateVist){
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

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
 * @param {*} _idProduct _id DEL PRODUCTO
 */
async function eliminarProduct(_id_negocio, _idProduct) {

    let productUpdate = await Negocio.update({ '_id': _id_negocio },
        {
            $pull: {
                computadora: { _id: { $eq: _idProduct } }
            }
        }
    );

    return productUpdate;
}

/**
 * CUANDO SE ACTUALICE ALGUNA LINEA DE LA COLECCION linea_productos
 * SE LLAMARA ESTE METODO PARA ACTUALIZAR LA LINEA DE LOS PRODUCTOS EXISTENTE
 * POR LA LINEA QUE SE DESEA ACTUALIZAR
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} marcaOld MARCA ACTUAL
 * @param {*} marcaNew MARCA NUEVA POR ACTUALIZAR
 */
async function updateMarcaAllProduct(marcaOld, marcaNew) {

    let productUpdate = await Negocio.updateMany({},
        {
            $set: {
                'computadora.$[rop].marca': marcaNew
            }
        },
        {
            arrayFilters: [{ "rop.marca": { $eq: marcaOld } }]
        }
    );

    return productUpdate;
}

/**
 * ACTUALIZAR EL ESTADO DEL PRODUCTO A TRUE O FALSE
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} _id_product _id DEL PRODUCTO
 * @param {*} status ESTADO FALSE O TRUE
 */
async function updateStatusProduct(_id_negocio, _id_product, status) {


    let productUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $set: {
                'computadora.$[rop].estado': status
            }
        },
        {
            arrayFilters: [{ "rop._id": { $eq: _id_product } }]
        });

    return productUpdate;
}

/**
 * ACTUALIZA LOS DATOS DEL PRODUCTO 
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} _id_product _id DEL PRODUCTO
 * @param {*} datos_product DATOS DEL PRODUCTO EN JSON
 */
async function actualizarProduct(_id_negocio, _id_product, datos_product) {

    let productUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $set: {
                'computadora.$[rop]': datos_product
            }
        },
        {
            arrayFilters: [{ "rop._id": { $eq: _id_product } }]
        });

    return productUpdate;
}

/**
 * GUARDA UN PRODUCTO EN LA COLECCION DE NEGOCIO DENTRO DE UN ARRAY
 * @param {*} _idNegocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} datos_ropa DATOS DEL PRODUCTO EN JSON
 */
async function agregaProduct(_idNegocio, datos_ropa) {

    let ropaInsert = await Negocio.updateOne({ _id: _idNegocio },
        {
            $push: {
                'computadora': datos_ropa
            }
        }, { new: true });

    return ropaInsert;
}

async function agregarImagen(_idNegocio, _idProducto, rutaImage) {

    let productUpdate = await Negocio.updateOne({
        "_id": _idNegocio,
        "computadora._id": _idProducto
    }, {
        "$push":
            { "computadora.$.imagen": { "ruta": rutaImage } }
    });

    return productUpdate;
}

async function actualizarImagen(_idNegocio, _idProducto, _id_image, rutaImage) {
    let productUpdate = await Negocio.updateOne(
        { "_id": { $eq: _idNegocio } },
        { $set: { "computadora.$[prod].imagen.$[img].ruta": rutaImage } },
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
                'computadora.$[prod].vistas': 1
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
 * ACTUALIZAMOS EL ARRAY A UN MATRIZ VACIO
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 */
async function borrarListaProducto(_id_negocio) {

    let productUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $set: {
                'computadora': []
            }
        }
    );

    return productUpdate;
}

module.exports = controller;