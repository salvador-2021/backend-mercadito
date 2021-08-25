'use strict'
const Negocio = require('../../models/negocio');
const Validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/development.json');

var controller = {

    autenticationNegocio: (req, res) => {
       
        var correo = req.body.correo;
        var password = req.body.password;

        try {
            var validate_correo = !Validator.isEmpty(correo);

            if (!validate_correo) {

                return res.status(400).send({
                    status: "error",
                    message: "El campo email esta vacio"
                });
            }

            if (!Validator.isEmail(correo)) {

                return res.status(400).send({
                    status: "error",
                    message: "El correo no es valido"
                });
            }

            var validate_password = !Validator.isEmpty(password);

            if (!validate_password) {
                return res.status(400).send({
                    status: "error",
                    message: "El campo contraseña esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Faltan datos"
            });
        }

        Negocio.findOne({ correo: correo })
            .then(datos => {

                if (datos) {
                    console.log("Negocio , ",datos);
                    const passwordValido = bcrypt.compareSync(password, datos.password);

                    if (!passwordValido) {
                        res.status(200).json({
                            status: 'Usuario invalido',
                            msj: 'Usuario o contraseña incorrecta.'
                        })
                    }

                    if (passwordValido) {
                        const jwToken = jwt.sign({
                            negocio: { _id: datos._id, nombre: datos.nombre, correo: datos.correo, tipo: "negocio" , password:datos.password}
                        },
                            config.configToken.SEED,
                            { expiresIn: config.configToken.expiration });

                        res.status(200).json({
                            status: 'success',
                            negocio: {
                                _id: datos._id,
                                nombre: datos.nombre,
                                correo: datos.correo,
                                tipo:"negocio"
                            },
                            token: jwToken
                        })
                    }
                } else {
                    res.status(200).json({
                        status: 'Usuario invalido',
                        message: 'Usuario o contraseña incorrecta.'
                    });
                }

            })
            .catch(err => {
                res.status(500).json({
                    status: 'error',
                    msj: err

                });
            });
    },
   
};

module.exports = controller;