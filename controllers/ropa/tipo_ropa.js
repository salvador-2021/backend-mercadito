'use strict'
const Validator = require('validator');
const TipoRopa = require('../../models/ropa/tipo_ropa');

var controller = {

    saveTipoRopa: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;

        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }
        //DATOS QUE VIENE DESDE POST
        var tipo = req.body.tipo;

        try {

            var validate_tipo = !Validator.isEmpty(tipo);

            if (!validate_tipo) {

                return res.status(400).send({
                    status: "error",
                    message: "El campo tipo esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: error
            });
        }

        var resultfind = findTipoRopa(tipo.toUpperCase());

        resultfind.then(tipoEnc => {

            if (tipoEnc.length == 0) {

                //================================================
                var resultado = guardarTipoRopa(tipo.toUpperCase());

                resultado.then(tipo => {

                    return res.status(200).send({
                        status: "success",
                        message: tipo
                    });

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: error
                    });
                });
                //==================================================
            }

            if (tipoEnc) {

                if (tipoEnc.length > 0) {

                    return res.status(200).send({
                        status: "duplicado",
                        message: "La marca del zapato ya existe"
                    });
                }
            }

        }).catch(error => {
            return res.status(200).send({
                status: "error",
                message: "Error al buscar la marca del zapato " + error
            });
        });

    },

    updateTipoRopa: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        var _id_tipo = req.params._id;
        var tipobody = req.body.tipo;

        //Validar datos
        try {

            var validate_tipo = !Validator.isEmpty(tipobody);

            if (!validate_tipo) {

                return res.status(400).send({
                    status: "error",
                    message: "El valor tipo de ropa esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Faltan datos"
            });
        }

        //VERIFICAR EL NOMBRE Y CORREO NO SE DUPLIQUE
        let resultado = findTipoRopaExist(tipobody.toUpperCase());

        resultado.then(list_tipo => {

            if (list_tipo.length == 0) {

                //===================================================================

                //Actualizar datos
                let resultUpdateNegocio = updateTipoRopa(_id_tipo, tipobody.toUpperCase());

                resultUpdateNegocio.then(resultTipo => {

                    if (resultTipo) {
                        return res.status(200).send({
                            status: "success",
                            message: resultTipo
                        });
                    }

                    if (!resultTipo) {
                        return res.status(404).send({
                            status: "Error",
                            message: "No se encontró el recurso."
                        });
                    }

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al actualizar el tipo de ropa " + error
                    });
                });
                //===================================================================

            } else if (list_tipo.length == 1) {

                var idEncontrado = list_tipo[0]["_id"];

                if (idEncontrado == _id_tipo) {
                    //===================================================================
                    return res.status(200).send({
                        status: "success",
                        message: "Dato actualizado"
                    });

                    //===================================================================

                } else {

                    return res.status(409).send({
                        status: "duplicado",
                        message: "El tipo de ropa ya existe"
                    });

                }

            } else if (list_tipo.length >= 2) {

                return res.status(409).send({
                    status: "duplicado",
                    message: "El tipo de ropa ya existe"
                });
            }

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },

    search_all_tipo_ropa : (req , res )=>{
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {

            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        let resultTipoRopa = TipoRopa.find().sort({tipo:1});

        resultTipoRopa.then(result => {

            if (result.length > 0) {

                return res.status(200).send({
                    status: "success",
                    message: result
                });
            }

            if(result.length==0){
                return res.status(404).send({
                    status: "vacio",
                    message: "Lista vacia"
                });
            }

        }).catch(err =>{
            return res.status(500).send({
                status: "error",
                message: "Error al buscar el tipo de ropa "+ err
            });
        });

    },

    searchTipoRopa: (req, res) => {
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        var tipoRopaB = req.body.tipo;

        try {
            var validate_tipoRopa = !Validator.isEmpty(tipoRopaB);

            if(!validate_tipoRopa){
                return res.status(400).send({
                    status: "error",
                    message: "El valor tipo de ropa esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Faltan valores"
            });
        }

        var listaEncontrados = [];
        let resultTipo = TipoRopa.find().sort({tipo:1});

        resultTipo.then(result => {

            if (result.length > 0) {

                
                result.forEach((tipos_encontrado, index, data) => {

                    let tipo_enc = tipos_encontrado['tipo'];

                    let existeValor = tipo_enc.includes(tipoRopaB.toUpperCase());

                    if (existeValor) {
                       
                        listaEncontrados.push(tipo_enc);
                    }
                });

                if(listaEncontrados.length==0){

                    return res.status(400).send({
                        status: "vacio",
                        message: "El tipo de ropa no existe"
                    });

                }

                return res.status(200).send({
                    status: "success",
                    message: listaEncontrados
                });

            }

            if(result.length==0){
                return res.status(404).send({
                    status: "vacio",
                    message: "Tipo de ropa no existe"
                });
            }

        }).catch(err =>{
            return res.status(500).send({
                status: "error",
                message: "Error al buscar el tipo de ropa "+ err
            });
        });
    }
};

async function guardarTipoRopa(tipoInsert) {

    let tipo_Insert = new TipoRopa({
        tipo: tipoInsert
    });

    return await tipo_Insert.save();
}

async function updateTipoRopa( _id , tipoUp) {

    let tipoRopa_Update = await TipoRopa.findByIdAndUpdate(_id,
        {
            $set: {
                tipo: tipoUp,
            }
        }, { new: true }
    );

    return tipoRopa_Update;
}

async function findTipoRopa(tipoB) {
    let resultTipo = await TipoRopa.find({ tipo: tipoB });

    return resultTipo;
}

async function findTipoRopaExist(tipoB) {

    let resultMarca = await TipoRopa.find({ tipo: tipoB }).select({ _id: 1 });

    return resultMarca;
}

module.exports = controller;