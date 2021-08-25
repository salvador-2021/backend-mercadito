'use strict'
const Validator = require('validator');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

var controller = {

    crear_usuario: (req, res) => {
        //Recoger parametros por post
        var body = req.body;

        //VERIFICAMOS QUE EL NOMBRE Y EL CORREO NO ESTE GUARDADO EN OTRA CUENTA
        let usuarioEncontrado = existNombreCorreo(body.correo, body.nombre);

        usuarioEncontrado.then(usuarioEn => {

            if (!usuarioEn) {

                //==================================================
                let usuarioInsert = crearUsuario(body);

                usuarioInsert.then(usuario => {
                    return res.status(200).send({
                        status: "success",
                        message: usuario
                    });
                }).catch(err => {
                    return res.status(500).send({
                        status: "error",
                        message: err
                    });
                });
                //==================================================

            } else if (usuarioEn) {

                return res.status(200).send({
                    status: "duplicado",
                    message: "Nombre o correo duplicaco"
                });
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },

    getDataUser: (req, res) => {
        const _iduser = req.usuario_autentificado._id;

        Usuario.findOne({ _id: _iduser }).
            exec((err, usuario) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: err
                    });
                }

                if (!usuario) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "No existe el usuario"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: usuario
                });
            });
    },

    existeUserAdmin: (req, res) => {
        
        Usuario.findOne({ tipo: "ADMINISTRADOR" }).
            exec((err, usuario) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: err
                    });
                }

                if (!usuario) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "No existe el usuario"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: "Existe"
                });
            });
    },
    getNameUser: (req, res) => {
        var _iduser = req.params._id;
    
        Usuario.findOne({ _id: _iduser }).select({ nombre: 1 }).
            exec((err, usuario) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: err
                    });
                }

                if (!usuario) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "No existe el usuario"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: usuario
                });
            });
    },
    updatePassword: (req, res) => {

        //DATOS DEL USUARIO ACTUALMENTE EN EL SISTEMA
        const usuarioAuth = req.usuario_autentificado;
        const passwordActual = usuarioAuth.password;
        const _idusuario = usuarioAuth._id;

        //DATOS QUE VIENE DESDE EL FORMULARIO 
        const body = req.body;
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

            let resultUpdate = updatePassword(_idusuario, passwordNew);

            resultUpdate.then(pass => {
                if(!pass){
                    return res.status(404).send({
                        status: "vacio",
                        message: "Registro no actualizado"
                    });
                }
                return res.status(200).send({
                    status: "success",
                    message: "Contraseña actualizado correctamente"
                });
            }).catch(error => {
                return res.status(500).send({
                    status: "error",
                    message: error
                });
            });

        }

    },

    delete_user: (req, res) => {

        //Recoger el id por la URL
        const _iduser = req.usuario_autentificado._id;
        Usuario.findOneAndDelete({ _id: _id_user }, (err, usuarioRemoved) => {
            if (err) {
                return res.status(500).send(
                    {
                        status: "error",
                        message: err
                    }
                );
            }

            if (!usuarioRemoved) {
                return res.status(404).send(
                    {
                        status: "error",
                        message: "Datos no eliminados"
                    }
                );
            }

            return res.status(200).send(
                {
                    status: "success",
                    message: "Usuario eliminado"
                }
            );

        });
    },

    update_usuario: (req, res) => {
        //ACTUALIZACION DEL CORREO Y EL NOMBRE DEL USUARIO
        const _idusuario = req.usuario_autentificado._id;
        const body = req.body;
        let usuarioEncontrado = findUsuarioCorreoUpdate(body.nombre, body.correo);
        usuarioEncontrado.then(usuarioEnc => {

            if (usuarioEnc.length == 0) {

                //===================================================================

                //Actualizar datos

                let usuarioUpdate = updateUsuario(_idusuario, body);

                usuarioUpdate.then(usuario => {
                    return res.status(200).send({
                        status: "success",
                        message: usuario
                    });
                }).catch(err => {
                    return res.status(500).send({
                        status: "error",
                        message: "Usuario no actualizado, posiblemente el usuario no existe " + err
                    });
                });

                //===================================================================

            } else if (usuarioEnc.length == 1) {

                var idEncontrado = usuarioEnc[0]["_id"];

                //SI SE CUMPLE LA CONDICION , SE PODRA ACTUALIZAR EL REGISTRO
                if (idEncontrado == _idusuario) {
                    //===================================================================

                    //Actualizar datos

                    let usuarioUpdate = updateUsuario(_idusuario, body);

                    usuarioUpdate.then(usuarioUp => {
                        return res.status(200).send({
                            status: "success",
                            message: usuarioUp
                        });

                    }).catch(err => {
                        return res.status(500).send({
                            status: "error",
                            message: "Usuario no actualizado"
                        });
                    });

                    //===================================================================

                } else {
                    return res.status(200).send({
                        status: "duplicado",
                        message: "Revisa el usuario y correo electrónico"
                    });
                }

            } else if (usuarioEnc.length >= 2) {
                return res.status(200).send({
                    status: "duplicado",
                    message: "Revisa el usuario y correo electrónico"
                });
            }

        }).catch(err => {
            return res.status(500).send({
                status: "err",
                message: err
            });
        });
    },

    cantidadUsuariosExistente: (req, res) => {
        var queryMongo = Usuario.find({ "estado": false });

        var estadoParaments = req.params.estado;

        if (estadoParaments && estadoParaments === 'Activo') {

            queryMongo = Usuario.find({ "estado": true });
        }

        queryMongo.count().exec((err, usuarios) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al mostrar los usuario"
                });
            }

            if (usuarios.length == 0) {
                return res.status(200).send({
                    status: "error",
                    message: "No hay usuarios para mostrar"
                });
            }

            return res.status(200).send({
                status: "success",
                message: usuarios
            });

        });
    },

    getUsuarios: (req, res) => {
        var queryMongo = Usuario.find({ "estado": false });

        var estadoParaments = req.params.estado;

        if (estadoParaments && estadoParaments === 'Activo') {

            queryMongo = Usuario.find({ "estado": true });
        }

        queryMongo.sort({ fecha_reg: -1 }).exec((err, usuarios) => {

            if (err) {
                return res.status(200).send({
                    status: "error",
                    message: "Error al mostrar los usuarios"
                });
            }

            if (usuarios.length == 0) {
                return res.status(200).send({
                    status: "error",
                    message: "No hay usuarios para mostrar"
                });
            }
            return res.status(200).send({
                status: "success",
                message: usuarios
            });

        });
    }
};

async function updatePassword(_id, passwordUpdate) {
    let usuarioUpdate = await Usuario.findByIdAndUpdate(_id,
        {
            $set: {
                password: bcrypt.hashSync(passwordUpdate, 10)
            }
        }, { new: true }
    );

    return usuarioUpdate;
}

async function existNombreCorreo(correoB, nombreB) {
    let usuariofind = await Usuario.findOne().or([{ correo: correoB }, { nombre: nombreB }]);

    return usuariofind;
}

async function findUsuarioCorreoUpdate(usuarioB, correoB) {

    let usuariofind = await Usuario.find().or([{ nombre: usuarioB }, { correo: correoB }]).select({ _id: 1 });

    return usuariofind;
}

async function crearUsuario(body) {
    let UsuarioInsert = new Usuario({
        nombre: body.nombre,
        tipo: body.tipo,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10)
    });

    return await UsuarioInsert.save();
}

async function updateUsuario(_id, body) {
    let usuarioUpdate = await Usuario.findByIdAndUpdate(_id,
        {
            $set: {
                nombre: body.nombre,
                correo: body.correo,
            }
        }, { new: true });

    return usuarioUpdate;
}

module.exports = controller;