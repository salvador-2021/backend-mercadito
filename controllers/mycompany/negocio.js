'use strict'
const mongoose = require('mongoose');
const Validator = require('validator');
const Negocio = require('../../models/negocio');
const bcrypt = require('bcrypt');
var fs = require('fs');//PARA ELIMINAR ARCHIVOS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS

var controller = {

    guardarDatos: (req, res) => {
        var params = req.body;

        //BUSCAMOS SI EL CORREO ESTA REPETIDO
        //BUSCAMOS SI EL NOMBRE DEL NEGOCIO ESTA REPETIDO
        let resultado = findNegocioByNombreCorreo(params.nombre.toUpperCase(), params.correo);

        resultado.then(negocioen => {

            if (negocioen.length == 0 || !negocioen) {
                const _idproducto = new mongoose.Types.ObjectId();
                //=================Guardar datos====================
                let resultado = crearNegocio(_idproducto, params);
                resultado.then(negocio => {

                    if (!negocio) {
                        return res.status(200).send({
                            status: "vacio",
                            message: "Producto no encontrado"
                        });
                    }

                    //CREACION DE DIRECTORIOS PARA LA SUBIDA DE ARCHIVOS
                    creacionCarpetas(negocio["_id"]);

                    return res.status(200).send({
                        status: "success",
                        message: _idproducto
                    });

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: error
                    });
                });
                //====================================================

            } else if (negocioen.length > 0) {

                return res.status(400).send({
                    status: "duplicado",
                    message: "Revisa el nombre del negocio y el correo electrónico"
                });
            }
        }).catch(err => {
            return res.status(500).send({
                status: "err",
                message: err
            });
        });
    },
    getAnyDataNegocio: (req, res) => {
        /*OBTENEMOS TODOS LOS DATOS DEL NEGOCIO INDICANDO SU ID */
        const _idNegocio = req.params._id;
        Negocio.findById({ "_id": _idNegocio }).exec((err, negocio) => {

            return res.status(200).send({
                status: "success",
                message: negocio
            });
        });
    },

    getDataNegocio: (req, res) => {
        /*OBTENEMOS TODOS LOS DATOS DEL NEGOCIO INDICANDO SU ID */

        var _idNegocio = req.negocio_autentificado._id;

        Negocio.findById({ "_id": _idNegocio }).exec((err, negocio) => {

            return res.status(200).send({
                status: "success",
                message: negocio
            });
        });
    },

    getDataNegocioForPerfil: (req, res) => {
        /*OBTENEMOS LOS DATOS DEL NEGOCIO INDICANDO SU ID Y LOS CAMPOS A MOSTRAR*/
        const _idnegocio = req.params._id;
        Negocio.findById({ "_id": _idnegocio }).select({ estadoL: 1, nombre: 1, imagen_negocio: 1, telefono: 1, celular: 1, facebook: 1, horario_ser: 1, lineaNegocio: 1 , perfil:1 }).exec((error, negocio) => {

            if (error) {
                return res.status(500).send({
                    status: "error",
                    message: error
                });
            }

            if (!negocio) {
                return res.status(404).send({
                    status: "error",
                    message: "Lista vacia"
                });
            }

            return res.status(200).send({
                status: "success",
                message: negocio
            });
        });

    },

    actualizarDatosAnyNegocio: (req, res) => {

        var _idNegocio = req.params._id;

        //Recoger los datos que llegan por put
        var params = req.body;
        //VERIFICAR EL NOMBRE Y CORREO QUE NO SE DUPLIQUE
        let resultado = findNegocioNombreCorreoUpdate(params.nombre.toUpperCase(), params.correo);

        resultado.then(negocioen => {

            if (negocioen.length == 0) {

                //Actualizar datos
                let resultUpdateNegocio = actualizarNegocio(_idNegocio, params);

                resultUpdateNegocio.then(negocio => {

                    return res.status(200).send({
                        status: "success",
                        message: negocio
                    });

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: error
                    });
                });
                //===================================================================

            } else if (negocioen.length == 1) {

                var idEncontrado = negocioen[0]["_id"];

                //SI SE CUMPLE LA CONDICION , SE PODRA ACTUALIZAR EL REGISTRO
                if (idEncontrado == _idNegocio) {
                    //===================================================================

                    //Actualizar datos
                    let resultUpdateNegocio = actualizarNegocio(_idNegocio, params);

                    resultUpdateNegocio.then(negocio => {
                        return res.status(200).send({
                            status: "success",
                            message: negocio
                        });
                    }).catch(error => {
                        console.log("error 33", error);
                        return res.status(500).send({
                            status: "error",
                            message: error
                        });
                    });
                    //===================================================================

                } else {

                    return res.status(200).send({
                        status: "duplicado",
                        message: "Revisa el nombre del negocio o correo electrónico"
                    });

                }

            } else if (negocioen.length >= 2) {
                return res.status(200).send({
                    status: "duplicado",
                    message: "Revisa el nombre del negocio o correo electrónico"
                });
            }

        }).catch(err => {
            console.log("Error aqui actualizar any negocio", err);
            return res.status(500).send({
                status: "err",
                message: err
            });
        });

    },
    actualizarDatos: (req, res) => {
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

        //Recoger los datos que llegan por put
        var params = req.body;

        //VERIFICAR EL NOMBRE Y CORREO QUE NO SE DUPLIQUE
        let resultado = findNegocioNombreCorreoUpdate(params.nombre.toUpperCase(), params.correo);

        resultado.then(negocioen => {

            if (negocioen.length == 0) {

                //Actualizar datos
                let resultUpdateNegocio = actualizarNegocio(_idNegocio, params);

                resultUpdateNegocio.then(negocio => {

                    return res.status(200).send({
                        status: "success",
                        message: negocio
                    });

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: error
                    });
                });
                //===================================================================

            } else if (negocioen.length == 1) {

                var idEncontrado = negocioen[0]["_id"];

                //SI SE CUMPLE LA CONDICION , SE PODRA ACTUALIZAR EL REGISTRO
                if (idEncontrado == _idNegocio) {
                    //===================================================================

                    //Actualizar datos
                    let resultUpdateNegocio = actualizarNegocio(_idNegocio, params);

                    resultUpdateNegocio.then(negocio => {
                        return res.status(200).send({
                            status: "success",
                            message: negocio
                        });
                    }).catch(error => {
                        return res.status(500).send({
                            status: "error",
                            message: error
                        });
                    });
                    //===================================================================

                } else {

                    return res.status(200).send({
                        status: "duplicado",
                        message: "Revisa el nombre del negocio o correo electrónico"
                    });

                }

            } else if (negocioen.length >= 2) {
                return res.status(200).send({
                    status: "duplicado",
                    message: "Revisa el nombre del negocio o correo electrónico"
                });
            }

        }).catch(err => {
            return res.status(500).send({
                status: "err",
                message: err
            });
        });

    },//FIN DEL METODO actualizarDatos
    updatePassword: (req, res) => {
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


        const negocioAuth = req.negocio_autentificado;
        console.log(negocioAuth);
        const passwordActual = negocioAuth.password;
        const _idnegocio = negocioAuth._id;

        //DATOS QUE VIENE DESDE EL FORMULARIO 
        const body = req.body;
        console.log(body);
        const passwordOld = body.passwordOld;
        const passwordNew = body.passwordNew;

        //COMPARACION DE CONSTRASEÑAS, LA ACTUAL CON LA QUE EL USUARIO ENVIA
        const passwordValido = bcrypt.compareSync(passwordOld, passwordActual);

        if (!passwordValido) {
            res.status(404).json({
                status: 'error',
                msj: 'Contraseña incorrecta.'
            });
        }

        if (passwordValido) {

            let resultUpdate = updatePassword(_idnegocio, passwordNew);

            resultUpdate.then(pass => {
                if (!pass) {
                    return res.status(404).send({
                        status: "success",
                        message: "hubo un error en el servidor, intentalo mas tarder"
                    });
                }
                return res.status(200).send({
                    status: "success",
                    message: "Contraseña actualizado correctamente"
                });

            }).catch(error => {
                return res.status.send({
                    status: "error",
                    message: error
                });
            });

        }
    },
    delete_negocio: (req, res) => {

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

        Negocio.findOneAndDelete({ _id: _idNegocio }, (err, negocioRemoved) => {
            if (err) {
                return res.status(400).send(
                    {
                        status: "error",
                        message: "Datos no eliminado, posiblemente no existe el registro"
                    }
                );
            }

            if (!negocioRemoved) {
                return res.status(400).send(
                    {
                        status: "error",
                        message: "Datos no eliminados"
                    }
                );
            }

            return res.status(200).send(
                {
                    status: "success",
                    message: "Datos eliminados"
                }
            );

        });
    },
    //RECUPERA LOS NEGOCIOS ACTIVOS O NO ACTIVOS PASANDO POR PARAMETRO -Activo
    getNegocios: (req, res) => {

        var queryMongo = Negocio.find({ "estado": false });
        var estadoParaments = req.params.estado;


        if (estadoParaments && estadoParaments === 'Activo') {
            queryMongo = Negocio.find({ "estado": true });
        }

        queryMongo.sort({ fecha_reg: -1 }).exec((err, negocios) => {

            if (err) {
                return res.status(200).send({
                    status: "error",
                    message: "Error al mostrar los negocios"
                });
            }

            if (negocios.length == 0) {
                return res.status(200).send({
                    status: "error",
                    message: "No hay negocios para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                message: negocios
            });

        });
    },
    //DESACTIVACION O ACTIVACION DEL NEGOCIO RECIBIENDO -TRUE , FALSE
    activarNegocio: (req, res) => {

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
        var body = req.body;

        try {
            var validate_estado = !Validator.isEmpty(body.estado);
            if (!validate_estado) {
                return res.status(200).send({
                    status: 'error',
                    message: 'Dato estado no encontrado'
                });
            }
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        Negocio.findOneAndUpdate({ _id: _idNegocio }, body, { new: true }, (err, negocioupdate) => {

            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al actualizar el estado del negocio !!!'
                });
            }

            if (!negocioupdate) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo !!!'
                });
            }

            return res.status(404).send({
                status: 'succes',
                message: 'Actualización exitosa !!!'
            });

        });
    },
    activarNegocioAdministrador: (req, res) => {

        try {

            if (typeof req.usuario_autentificado.tipo === 'undefined') {
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

        var tipoUser = req.usuario_autentificado.tipo;

        if (tipoUser === 'ADMINISTRADOR') {

            var body = req.body;

            try {
                var validate_estado = !Validator.isEmpty(body.estado);
                if (!validate_estado) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Dato estado no encontrado'
                    });
                }
            } catch (error) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Faltan datos por enviar !!!'
                });
            }

            let _idNegocio = req.params._id;
            Negocio.findOneAndUpdate({ _id: _idNegocio }, body, { new: true }, (err, negocioupdate) => {

                if (err) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al actualizar el estado del negocio !!!'
                    });
                }

                if (!negocioupdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo !!!'
                    });
                }

                return res.status(404).send({
                    status: 'succes',
                    message: 'Actualización exitosa !!!'
                });

            });

        } else {

            return res.status(400).send({
                status: "error",
                message: "Usuario no identificado"
            });

        }
    },
    buscarNegocioNombre: (req, res) => {
        var nombre_negocio = req.params.nombre;
        try {
            var nombre = !Validator.isEmpty(nombre_negocio);
            if (!nombre) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El campos buscar esta vacio'
                });
            }

        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        Negocio.find({ "nombre": { $regex: nombre_negocio, $options: 'i' } }).and({ estado: true }).exec((err, negocio) => {

            if (err) {
                return res.status(200).send({
                    status: "error",
                    message: "Error al buscar el negocio"
                });
            }

            if (negocio.length == 0) {
                return res.status(200).send({
                    status: "No encontrado",
                    message: "Negocio no encontrado"
                });
            }
            return res.status(200).send({
                status: "success",
                message: negocio
            });

        });
    },

    cantidadNegociosExistente: (req, res) => {

        var queryMongo = Negocio.find({ "estado": false });
        var estadoParaments = req.params.estado;

        console.log(estadoParaments);

        if (estadoParaments && estadoParaments === 'Activo') {

            queryMongo = Negocio.find({ "estado": true });
        }

        queryMongo.count().exec((err, negocios) => {

            if (err) {
                return res.status(200).send({
                    status: "error",
                    message: "Error al mostrar los negocios"
                });
            }

            if (negocios.length == 0) {
                return res.status(200).send({
                    status: "error",
                    message: "No hay negocios para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                message: negocios
            });

        });
    },

    uploadFileImg: (req, res) => {
        console.log("Estas entrando aqui negocio , upload");
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

        //ID DEL NEGOCIO
        var _idNegocio = req.negocio_autentificado._id;

        var file_name = 'Imagen no subido';

        if (!req.file) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //ACHIVO RECOGIDO POR PARAMETRO
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

            Negocio.findOne({ _id: _idNegocio }).
                select({ imagen_negocio: 1 }).
                exec((err, resultquery) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al buscar el negocio'
                        });
                    }
                    if (resultquery) {
                        //RUTA DEL ARCHIVO
                        var rutaArchivo = './uploads/' + _idNegocio + '/' + resultquery['imagen_negocio'];

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
                });

            Negocio.findOneAndUpdate({ _id: _idNegocio }, { imagen_negocio: file_name }, { new: true }, (error, negocioUpdate) => {
                if (error || !negocioUpdate) {
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al actualizar los datos"
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    message: negocioUpdate
                });
            }
            );
        }
    },
    subidaImg: (req, res) => {

        //ID DEL NEGOCIO
        var _idNegocio = req.params._id;
        console.log("subida de imagen " + _idNegocio);


        var file_name = 'Imagen no subido';

        if (!req.file) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //ACHIVO RECOGIDO POR PARAMETRO
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

            Negocio.findOne({ _id: _idNegocio }).
                select({ imagen_negocio: 1 }).
                exec((err, resultquery) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al buscar el negocio'
                        });
                    }
                    if (resultquery) {
                        //RUTA DEL ARCHIVO
                        var rutaArchivo = './uploads/' + _idNegocio + '/' + resultquery['imagen_negocio'];

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
                });

            Negocio.findOneAndUpdate({ _id: _idNegocio }, { imagen_negocio: file_name }, { new: true }, (error, negocioUpdate) => {
                if (error || !negocioUpdate) {
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al actualizar los datos"
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    message: negocioUpdate
                });
            }
            );
        }
    },
    //PUEDE CONSULTA USUARIO NORMAL
    getAnyNegocioImage: (req, res) => {

        var _idNegocio = req.params._id;
        var nameImage = req.params._nameImage;
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
    },
    getListNameNegocio: (req, res) => {

        Negocio.find().select({ "id": "$_id", "name" : "$nombre"}).
            exec((err, resultquery) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al buscar el negocio'
                    });
                }

                if (resultquery == null) {
                    return res.status(404).send({
                        status: 'vacio',
                        message: 'No existe ningún negocio.'
                    });
                }
                if (resultquery.length == 0) {
                    return res.status(404).send({
                        status: 'vacio',
                        message: 'No existe ningún negocio.'
                    });
                }

                if (resultquery) {
                    return res.status(200).send({
                        status: 'success',
                        message: resultquery
                    });
                }
            });
    },

    getImageNegocio: (req, res) => {

        const _idNegocio = req.negocio_autentificado._id;
        var nameImage = req.params._nameImage;
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
    },
    logo_negocio: (req, res) => {

        const _idNegocio = req.negocio_autentificado._id;

        Negocio.findOne({ _id: _idNegocio }).
            select({ imagen_negocio: 1 }).
            exec((err, resultquery) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al buscar el negocio'
                    });
                }

                if (resultquery['imagen_negocio'] == null) {
                    return res.status(404).send({
                        status: 'vacio',
                        message: 'La imagen no existe!!'
                    });
                }

                if (resultquery) {
                    //RUTA DEL ARCHIVO
                    var path_file = './uploads/' + _idNegocio + '/' + resultquery['imagen_negocio'];

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
            });

    },
    deleteImageAnyNegocio: (req, res) => {
        //AUTENTIFICAR USUARIO
        const _idNegocio = req.params._id;
        const _nameImage = req.params.nameImage;

        //RUTA DEL ARCHIVO A ELIMINAR
        const rutaArchivoEliminar = './uploads/' + _idNegocio + '/' + _nameImage;

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
    deleteImageNegocio: (req, res) => {
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
        const rutaArchivoEliminar = './uploads/' + _idNegocio + '/' + _nameImage;

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
    aumentarVistas: (req, res) => {
        let _idNegocio = req.params._id;

        let update = incrementarVista(_idNegocio);
        update.then(updateVist => {

            return res.status(200).send({
                status: "success",
                message: updateVist
            });

        }).catch(error => {

            return res.status(404).send({
                status: "error",
                message: error
            });

        });
    },
    updateLineaNegocio: (req, res) => {

        const bodydata = req.body;
        const _idnegocio = req.params._id;

        let update = updateLineaNegocio(_idnegocio, bodydata);
        update.then(updateLinea => {

            //console.log("actualizado ", updateLinea)
            return res.status(200).send({
                status: "success",
                message: updateLinea
            });

        }).catch(error => {
            return res.status(500).send({
                status: "error",
                message: error
            });

        });
    },
    getLineaNegocio: (req, res) => {
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
        const _idnegocio = req.negocio_autentificado._id;

        Negocio.findById({ "_id": _idnegocio }).select({ lineaNegocio: 1 }).exec((err, negocio) => {

            return res.status(200).send({
                status: "success",
                message: negocio
            });
        });
    }

};// fin

async function updateLineaNegocio(_id, body) {
    let NegocioUpdate = await Negocio.findByIdAndUpdate(_id,
        {
            $set: {
                lineaNegocio: body,
            }
        }, { new: true }
    );

    return NegocioUpdate;
}

//TODO://ESTE CODIGO SE VA A CAMBIAR DESPUES
async function crearNegocio(_idproducto, body) {
    //CUADO SE REGISTRA EL NEGOCIO, ESTARA ACTIVADO POR 2 MESES
    const fechaMas2meses = new Date();
    fechaMas2meses.setMonth(fechaMas2meses.getMonth() + 2);

    let NegocioInsert = new Negocio({
        _id: _idproducto,
        estadoL: body.estadoL.toUpperCase(),
        municipio: body.municipio.toUpperCase(),
        localidad: body.localidad.toUpperCase(),
        nombre: body.nombre.toUpperCase(),
        direccion: body.direccion,
        telefono: body.telefono,
        celular: body.celular,
        facebook: body.facebook,
        horario_ser: body.horario_ser,
        correo: body.correo,
        fecha_pago: fechaMas2meses, //ESTE CODIGO SE VA A CAMBIAR DESPUES
        password: bcrypt.hashSync(body.password, 10)
    });

    return await NegocioInsert.save();
}

async function incrementarVista(_idNegocio) {
    let NegocioUpdate = Negocio.updateOne(
        { _id: _idNegocio },
        { $inc: { vistas: 1 } }
    );

    return NegocioUpdate;
}

async function actualizarNegocio(_id, body) {

    let NegocioUpdate = await Negocio.findByIdAndUpdate(_id,
        {
            $set: {
                estadoL: body.estadoL.toUpperCase(),
                municipio: body.municipio.toUpperCase(),
                localidad: body.localidad.toUpperCase(),
                nombre: body.nombre.toUpperCase(),
                direccion: body.direccion,
                telefono: body.telefono,
                celular: body.celular,
                facebook: body.facebook,
                horario_ser: body.horario_ser,
                correo: body.correo,
                imagen_negocio: body.imagen_negocio
            }
        }, { new: true }
    );

    return NegocioUpdate;
}

async function updatePassword(_id, passwordUpdate) {
    let NegocioUpdate = await Negocio.findByIdAndUpdate(_id,
        {
            $set: {
                password: bcrypt.hashSync(passwordUpdate, 10)
            }
        }, { new: true }
    );
    return NegocioUpdate;
}

async function findNegocioByNombreCorreo(nombreB, correoB) {
    let negociofind = await Negocio.find().or([{ nombre: nombreB }, { correo: correoB }]);

    return negociofind;
}

async function findNegocioNombreCorreoUpdate(nombreB, correoB) {

    let negociofind = await Negocio.find().or([{ nombre: nombreB }, { correo: correoB }]).select({ _id: 1 });

    return negociofind;
}

function creacionCarpetas(_idNegocio) {

    var rutaDestino = './uploads/' + _idNegocio + '/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/abarrote/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/alimento/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/accesorio_movil/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/bicicleta/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/bodega/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/computadora/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/celulares/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/cerrajeria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/cama/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/carpinteria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/construccion/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/dentista/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/fruteria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/farmacia/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/fotos/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/ferreteria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/fierro/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/floreria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/funeraria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/herreria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/hivernadero/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/joyeria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/muebleria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/moto/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/optica/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/plomeria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/pintura/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/papeleria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/tela/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/television/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/relojeria/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/ropas/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/servicios/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/veladora/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/zapatos/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    //ELECTROMESTICOS
    rutaDestino = './uploads/' + _idNegocio + '/microonda/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/licuadora/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/plancha/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/refrigerador/';
    fs.mkdirSync(rutaDestino, { recursive: true });

    rutaDestino = './uploads/' + _idNegocio + '/ventilador/';
    fs.mkdirSync(rutaDestino, { recursive: true });
}


module.exports = controller;