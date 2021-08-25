'use strict'
const Validator = require('validator');
const TipoZapato = require('../../models/zapato/tipo_zapato');

var controller = {

    saveTipoZapato: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;

        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(400).send({
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
            return res.status(400).send({
                status: "error",
                message: error
            });
        }

        var resultfind = findTipoZapato(tipo.toUpperCase());

        resultfind.then(tipoEnc => {

            if (tipoEnc.length == 0) {

                //================================================
                var resultado = guardarTipoZapato(tipo.toUpperCase());

                resultado.then(tipoSave => {

                    return res.status(200).send({
                        status: "success",
                        message: tipoSave
                    });

                }).catch(error => {
                    return res.status(200).send({
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
                        message: "El tipo del zapato ya existe"
                    });
                }
            }

        }).catch(error => {
            return res.status(200).send({
                status: "error",
                message: "Error al buscar la marca del zapato"
            });
        });

    },

    updateTipoZapato: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(400).send({
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
                    message: "El valor tipo de zapato esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Faltan datos"
            });
        }

        //VERIFICAR EL NOMBRE Y CORREO NO SE DUPLIQUE
        let resultado = findTipoZapatoExist(tipobody.toUpperCase());

        resultado.then(list_tipo => {

            if (list_tipo.length == 0) {

                //===================================================================

                //Actualizar datos
                let resultUpdateNegocio = updateTipoZapato(_id_tipo, tipobody.toUpperCase());

                resultUpdateNegocio.then(resultTipo => {

                    if (resultTipo) {
                        return res.status(200).send({
                            status: "success",
                            message: resultTipo
                        });
                    }

                    if (!resultTipo) {
                        return res.status(200).send({
                            status: "Error",
                            message: "Error al actualizar el tipo de zapato"
                        });
                    }

                }).catch(error => {
                    return res.status(200).send({
                        status: "error",
                        message: "Error al actualizar el tipo de zapato"
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

                    return res.status(400).send({
                        status: "duplicado",
                        message: "El tipo de zapato ya existe"
                    });

                }

            } else if (list_tipo.length >= 2) {

                return res.status(400).send({
                    status: "duplicado",
                    message: "El tipo de zapato ya existe"
                });
            }

        }).catch(err => {
            return res.status(400).send({
                status: "err",
                message: err
            });
        });
    },

    search_all_tipo_zapato : (req , res )=>{
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(400).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        let resultTipoZapato = TipoZapato.find().sort({tipo:1});

        resultTipoZapato.then(result => {

            if (result.length > 0) {

                return res.status(400).send({
                    status: "success",
                    message: result
                });
            }

            if(result.length==0){
                return res.status(400).send({
                    status: "success",
                    message: "Lista vacia"
                });
            }

        }).catch(err =>{
            return res.status(400).send({
                status: "error",
                message: "Error al buscar el tipo de zapato"
            });
        });

    },

    searchTipoZapato: (req, res) => {
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(400).send({
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
                    message: "El valor tipo de zapato esta vacio"
                });
            }

        } catch (error) {
            return res.status(400).send({
                status: "error",
                message: "Faltan valores"
            });
        }

        var listaEncontrados = [];
        let resultTipo = TipoZapato.find().sort({tipo:1});

        resultTipo.then(result => {

            if (result.length > 0) {

                
                result.forEach((tipos_encontrado, index, data) => {

                    let tipo_enc = tipos_encontrado['tipo'];

                    let existeValor = tipo_enc.includes(tipoRopaB.toUpperCase());

                    if (existeValor) {
                       
                        listaEncontrados.push(tipos_encontrado);
                    }
                });

                if(listaEncontrados.length==0){

                    return res.status(400).send({
                        status: "Vacio",
                        message: "El tipo de zapato no existe"
                    });
                }

                return res.status(400).send({
                    status: "success",
                    message: listaEncontrados
                });

            }

            if(result.length==0){
                return res.status(400).send({
                    status: "success",
                    message: "Tipo de zapato no existe"
                });
            }

        }).catch(err =>{
            return res.status(400).send({
                status: "error",
                message: "Error al buscar el tipo de zapato"
            });
        });
    }
};

async function guardarTipoZapato(tipoInsert) {

    let tipo_Insert = new TipoZapato({
        tipo: tipoInsert
    });

    return await tipo_Insert.save();
}

async function updateTipoZapato( _id , tipoUp) {

    let tipoZapato_Update = await TipoZapato.findByIdAndUpdate(_id,
        {
            $set: {
                tipo: tipoUp,
            }
        }, { new: true }
    );

    return tipoZapato_Update;
}

async function findTipoZapato(tipoB) {
    let resultTipo = await TipoZapato.find({ tipo: tipoB });

    return resultTipo;
}

async function findTipoZapatoExist(tipoB) {

    let resultTipo = await TipoZapato.find({ tipo: tipoB }).select({ _id: 1 });

    return resultTipo;
}

module.exports = controller;