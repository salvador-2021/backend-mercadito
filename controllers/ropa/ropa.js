'use strict'
const mongoose = require('mongoose');
const Validator = require('validator');
const Negocio = require('../../models/negocio');
var fs = require('fs');//PARA ELIMINAR ARCHIVOS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS

var controller = {

    saveData: (req, res) => {
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
        var datos_ropa = {
            _id: _idproducto,
            nombre: body.nombre,
            descripcion: body.descripcion,
            detalle: body.detalle,
            marca: body.marca,
            tipo_ropa: body.tipo_ropa,
            genero: body.genero,
            tallas: body.tallas,
            colores: body.colores,
            unidadventa: body.unidadventa,
            existencia: body.existencia,
            precio: body.precio,
            precio_anterior: body.precio_anterior,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin
        };

        var result = agregaRopa(_idNegocio, datos_ropa);

        result.then(producUp => {

            if(!producUp){
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
            return res.status(500).send({
                status: "error",
                message: err
            });

        });

    }, //FIN DEL METODO GUARDAR ==================================

    getAllProductNegocio: (req, res) => {
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

        var listaProductoEncontrados = [];

        Negocio.find({ _id: _idNegocio }).
            and({ estado: true }).
            select({ ropas: 1, _id: 1 }).
            exec((err, listProducto) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if(!listProducto){
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                listProducto.forEach((productos, index, data) => {

                    productos['ropas'].forEach((producto, index, data) => {

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
    //hay cambio
    searchproductId: (req, res) => {

        if (req.params._id) { //BUSQUEDAD POR ID
            //FUNCIONA
            Negocio.findOne({ "ropas._id": req.params._id }, { "ropas.$": 1 }).exec((err, listProducto) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado " + err
                    });
                }

                if (!listProducto) { //<===============================================cambio
                    return res.status(404).send({
                        status: "No encontrado",
                        message: "Producto no encontrado"
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(404).send({
                        status: "No encontrado",
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
    searchproductName: (req, res) => {

        var queryMongo;
        var nombrebody = req.params.nombre;
        var _idNegocio = req.negocio_autentificado._id;

        queryMongo = Negocio.find({
            _id: _idNegocio,
            "$or": [
                { "ropas.nombre": { "$regex": nombrebody, "$options": "i" } },
                { "ropas.descripcion": { "$regex": nombrebody, "$options": "i" } }
            ]
        });

        var listaProductoEncontrados = [];
        queryMongo.
            and([{ estado: true }, { "ropas.estado": true }]).
            select({ ropas: 1, _id: 1 }).
            sort({ "ropas.precio": 1 }).
            exec((err, resultFind) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if(!resultFind){
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                if (resultFind.length == 0) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                resultFind.forEach((listproducto, index, data) => {

                    listproducto['ropas'].forEach((producto, index, data) => {

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
    getAllProduct: (req, res) => {

        Negocio.find().
            and([{ estado: true }, { "ropas.estado": true }]).
            select({ ropas: 1, _id: 1 }).
            sort({ "ropas.precio": 1 }).
            exec((err, listProducto) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if(!listProducto){
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(404).send({
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

    buscarMarca: (req, res) => {

        var marcaParams = req.params.marca;

        try {
            var validatorMarca = !Validator.isEmpty(marcaParams);
            if (!validatorMarca) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Selecciona la marca'
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        Negocio.find().
            and([{ estado: true }, { "ropas.estado": true }, { "ropas.marca": marcaParams }]).
            select({ ropas: 1, _id: 1 }).
            sort({ "ropas.precio": 1 }).
            exec((err, listProducto) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(404).send({
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

    searchSexo: (req, res) => {

        //DATOS QUE VIENEN POR POST
        var genero_persona = req.params.sexo;

        try {
            var validatorSexo = !Validator.isEmpty(genero_persona);
            if (!validatorSexo) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Selecciona el genero de la persona'
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        Negocio.find().
            and([{ estado: true }, { "ropas.estado": true }, { "ropas.sexo": genero_persona }]).
            select({ ropas: 1, _id: 1 }).
            sort({ "ropas.precio": 1 }).
            exec((err, listProducto) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(404).send({
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

    searchSexoTallaMarca: (req, res) => {
        /*BUSQUEDA DE LOS PRODUCTOS QUE TENGAN UNA LINEA EN ESPECIFICO*/
        //DATOS QUE VIENEN POR POST
        var producto_sexo = req.query.sexo;
        var producto_talla = req.query.talla;
        var producto_marca = req.query.marca;

        try {
            var validatorSexo = !Validator.isEmpty(producto_sexo);

            if (!validatorSexo) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El valor sexo esta vacio'
                });
            }

            var validatorTalla = !Validator.isEmpty(producto_talla);

            if (!validatorTalla) {

                return res.status(400).send({
                    status: 'error',
                    message: 'El valor talla esta vacio'
                });
            }

            var validatorMarca = !Validator.isEmpty(producto_marca);

            if (!validatorMarca) {

                return res.status(400).send({
                    status: 'error',
                    message: 'Selecciona una marca del producto'
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: error
            });

        }

        Negocio.find().
            and([{ estado: true }, { "ropas.estado": true }, { "ropas.sexo": producto_sexo }, { "ropas.talla": producto_talla }, { "ropas.marca": producto_marca }]).
            select({ ropas: 1, _id: 1 }).
            sort({ "ropas.precio": 1 }).
            exec((err, listProducto) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado " + err
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(404).send({
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

        var datos_ropa = {
            _id: body._id,
            imagen: body.imagen,
            nombre: body.nombre,
            descripcion: body.descripcion,
            detalle: body.detalle,
            marca: body.marca,
            tipo_ropa: body.tipo_ropa,
            genero: body.genero,
            tallas: body.tallas,
            colores: body.colores,
            unidadventa: body.unidadventa,
            existencia: body.existencia,
            precio: body.precio,
            precio_anterior: body.precio_anterior,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin
        };

        let resultUpdate = actualizarRopa(_id_negocio, _id_producto, datos_ropa);

        resultUpdate.then(productUpdate => {
            if (!productUpdate) {
                return res.status(200).send({
                    status: "vacio",
                    message: "producto no encontrado"
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

        //ELIMINACION DEL PRODUCTO POR ID DEL NEGOCIO AL QUE PERTENECE Y SU PROPIO ID
        var _id_negocio = req.negocio_autentificado._id;
        //RECOGEN DATOS POR POST
        var _id_ropa = req.params._id;

        let resultRemoved = eliminarProducto(_id_negocio, _id_ropa);

        resultRemoved.then(productRevomed => {

            if(!productRevomed){
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

    updateAllMarca: (req, res) => {

        //INDICANDO LA LINEA ANTIGUA Y LINEA NUEVA

        const body = req.body;
        const marcaOld = body.marcaOld;
        const marcaNew = body.marcaNew;

        var resultUpdate = updateMarcaAllProduct(marcaOld.toUpperCase(), marcaNew.toUpperCase());

        resultUpdate.then(productUpdate => {
            if (!productUpdate) {
                return res.status(404).send({
                    status: "vacio",
                    message: "Error al actualizar la marca del producto"
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
    countProductNegocio: (req, res) => {

        var queryMongo;
        var _idNegocio = req.negocio_autentificado._id;

        queryMongo = Negocio.find({ _id: _idNegocio });

        queryMongo.
            select({ ropas: 1 }).
            and([{ estado: true }]).
            exec((err, resultFind) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado"
                    });
                }

                if(!resultFind){
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                if (resultFind[0].ropas.length == 0 || resultFind[0].ropas.length == null) {
                    return res.status(200).send({
                        status: "success",
                        message: 0
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: resultFind[0].ropas.length
                });

            });
    },
    updateStatus: (req, res) => {
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

        const _id_negocio = req.negocio_autentificado._id;
        const _id_producto = req.body._id;
        const estado = req.body.estado;

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
            let rutaArchivoEliminar = './uploads/' + _idNegocio + '/ropa/' + file_name;

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
                        message: "No se encontró el recurso"
                    });
                }
            });

        } else {

            var _idProducto = req.query._idProducto;
            var _idImage = req.query._idImage;

            Negocio.findOne(
                { "_id": _idNegocio },
                { "ropas._id": _idProducto },
                { 'ropas.imagen._id': _idImage }).
                select({ 'ropas.imagen': 1 }).
                exec((err, resultquery) => {

                    if (err) {
                        return res.status(500).send({
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

                        resultquery["ropas"].forEach((lista_image, index, data) => {

                            lista_image["imagen"].forEach((datos, index, data) => {

                                if (datos['_id'] == _idImage) {

                                    //ELIMINACION DEL ARCHIVO SUBIDO ANTERIORMENTE
                                    var rutaArchivo = './uploads/' + _idNegocio + '/ropa/' + datos['ruta'];

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
        var path_file = './uploads/' + _idNegocio + '/ropas/' + nameImage;

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
        const rutaArchivoEliminar = './uploads/' + _idNegocio + '/ropa/' + _nameImage;

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
        const rutaArchivoEliminar = '../../uploads/' + _idnegocio + '/ropas';

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
 * @param {*} _id_ropa _id DEL PRODUCTO
 */
async function eliminarProducto(_id_negocio, _id_ropa) {

    let ropaUpdate = await Negocio.update({ '_id': _id_negocio },
        {
            $pull: {
                ropas: { _id: { $eq: _id_ropa } }
            }
        }
    );
    return ropaUpdate;
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
                'ropas.$[rop].marca': marcaNew
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
 * @param {*} _id_ropa _id DEL PRODUCTO
 * @param {*} status ESTADO FALSE O TRUE
 */
async function updateStatusProduct(_id_negocio, _id_ropa, status) {
    let productUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $set: {
                'ropas.$[rop].estado': status
            }
        },
        {
            arrayFilters: [{ "rop._id": { $eq: _id_ropa } }]
        });
    return productUpdate;
}

/**
 * ACTUALIZA LOS DATOS DEL PRODUCTO 
 * @param {*} _id_negocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} _id_ropa _id DEL PRODUCTO
 * @param {*} datos_ropa DATOS DEL PRODUCTO EN JSON
 */
async function actualizarRopa(_id_negocio, _id_ropa, datos_ropa) {
    let productUpdate = await Negocio.updateOne({ '_id': _id_negocio },
        {
            $set: {
                'ropas.$[rop]': datos_ropa
            }
        },
        {
            arrayFilters: [{ "rop._id": { $eq: _id_ropa } }]
        });
    return productUpdate;
}

/**
 * GUARDA UN PRODUCTO EN LA COLECCION DE NEGOCIO DENTRO DE UN ARRAY
 * @param {*} _idNegocio _id DEL NEGOCIO AL QUE PERTENECE EL PRODUCTO
 * @param {*} datos_ropa DATOS DEL PRODUCTO EN JSON
 */
async function agregaRopa(_idNegocio, datos_ropa) {
    let ropaInsert = await Negocio.updateOne({ _id: _idNegocio },
        {
            $push: {
                'ropas': datos_ropa
            }
        }, { new: true });

    return ropaInsert;
}

async function agregarImagen(_idNegocio, _idProducto, rutaImage) {
    let productUpdate = await Negocio.updateOne({
        "_id": _idNegocio,
        "ropas._id": _idProducto
    }, {
        "$push":
            { "ropas.$.imagen": { "ruta": rutaImage } }
    });
    return productUpdate;
}

async function actualizarImagen(_idNegocio, _idProducto, _id_image, rutaImage) {
    let productUpdate = await Negocio.updateOne(
        { "_id": { $eq: _idNegocio } },
        { $set: { "ropas.$[prod].imagen.$[img].ruta": rutaImage } },
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
                'ropas.$[prod].vistas': 1
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
                'ropas': []
            }
        }
    );

    return productUpdate;
}

module.exports = controller;

