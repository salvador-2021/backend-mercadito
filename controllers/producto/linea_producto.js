'use strict'
const Validator = require('validator');
const LineaProducto = require('../../models/linea_producto');

var controller = {

    saveLinea: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }
        //DATOS QUE VIENE DESDE POST
        var linea = req.body.linea;

        try {
            var validate_linea = !Validator.isEmpty(linea);

            if (!validate_linea) {

                return res.status(400).send({
                    status: "error",
                    message: "El campo linea esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: error
            });
        }

        var resultfind = findLinea(linea.toUpperCase());

        resultfind.then(lineaEnc => {

            if (lineaEnc.length == 0) {

                //================================================
                var resultado = crearLinea(linea.toUpperCase());

                resultado.then(linea => {

                    return res.status(200).send({
                        status: "success",
                        message: linea
                    });

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: error
                    });
                });
                //==================================================
            }

            if (lineaEnc) {

                if (lineaEnc.length > 0) {
                    return res.status(409).send({
                        status: "duplicado",
                        message: "La linea de producto ya existe"
                    });
                }
            }

        }).catch(error => {
            return res.status(500).send({
                status: "error",
                message:error
            });
        });

    },
    updateLinea: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        var _id_linea = req.params._id;
        var linea = req.body.linea;

        //Validar datos
        try {

            var validate_linea = !Validator.isEmpty(linea);

            if (!validate_linea) {
                return res.status(400).send({
                    status: "error",
                    message: "Falta dato por enviar"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Faltan datos"
            });
        }

        //VERIFICAR EL NOMBRE Y CORREO NO SE DUPLIQUE
        let resultado = findLineaExist(linea.toUpperCase());

        resultado.then(list_linea => {

            if (list_linea.length == 0) {

                //===================================================================

                //Actualizar datos
                let resultUpdateNegocio = updateLinea(_id_linea, linea.toUpperCase());

                resultUpdateNegocio.then(resultlinea => {

                    if (resultlinea) {
                        return res.status(200).send({
                            status: "success",
                            message: resultlinea
                        });
                    }

                    if (!resultlinea) {
                        return res.status(404).send({
                            status: "error",
                            message: "No se encontró el recurso"
                        });
                    }

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: error
                    });
                });
                //===================================================================

            } else if (list_linea.length == 1) {

                var idEncontrado = list_linea[0]["_id"];

                if (idEncontrado == _id_linea) {
                    //===================================================================
                    return res.status(200).send({
                        status: "success",
                        message: "Dato actualizado"
                    });

                    //===================================================================

                } else {

                    return res.status(409).send({
                        status: "duplicado",
                        message: "La linea del producto ya existe"
                    });

                }

            } else if (list_linea.length >= 2) {

                return res.status(409).send({
                    status: "duplicado",
                    message: "La linea del producto ya existe"
                });

            }

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },

    search_all_linea : (req , res )=>{
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        let resultLinea = LineaProducto.find().sort({linea:1});

        resultLinea.then(result => {

            if (result.length > 0) {
                return res.status(200).send({
                    status: "success",
                    message: result
                });
            }

            if(result.length==0){
                return res.status(404).send({
                    status: "vacio",
                    message: "No se encontró el recurso."
                });
            }

        }).catch(err =>{
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },

    searchLinea: (req, res) => {
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        var lineaB = req.body.linea;
        try {
            var validate_linea = !Validator.isEmpty(lineaB);

            if(!validate_linea){
                return res.status(400).send({
                    status: "error",
                    message: "El campo linea de producto esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: error
            }); 
        }

        var listaEncontrados = [];
        let resultLinea = LineaProducto.find().sort({linea:1});

        resultLinea.then(result => {

            if (result.length > 0) {

                result.forEach((lineas_encontrado, index, data) => {

                    let linea_pro_enc = lineas_encontrado['linea'];

                    let existeValor = linea_pro_enc.includes(lineaB.toUpperCase());

                    if (existeValor) {
                       
                        listaEncontrados.push(linea_pro_enc);
                    }
                });

                if(listaEncontrados.length==0){
                    return res.status(404).send({
                        status: "Vacio",
                        message: "La linea de producto no existe"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: listaEncontrados
                });

            }

            if(result.length==0){
                return res.status(404).send({
                    status: "success",
                    message: "Linea de producto no encontrado"
                });
            }

        }).catch(err =>{
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    }
};

async function crearLinea(lineaInsert) {

    let LineaInsert = new LineaProducto({
        linea: lineaInsert
    });

    return await LineaInsert.save();
}

async function updateLinea(_id, linea) {


    let lineaUpdate = await LineaProducto.findByIdAndUpdate(_id,
        {
            $set: {
                linea: linea,
            }
        }, { new: true }
    );

    return lineaUpdate;
}

async function findLinea(lineaB) {
    let resultLinea = await LineaProducto.find({ linea: lineaB });

    return resultLinea;
}

async function findLineaExist(lineaB) {

    let resultLinea = await LineaProducto.find({ linea: lineaB }).select({ _id: 1 });

    return resultLinea;
}

module.exports = controller;