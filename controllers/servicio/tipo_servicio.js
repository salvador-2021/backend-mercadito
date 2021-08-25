'use strict'
const Validator = require('validator');
const TipoServicio = require('../../models/tipo_servicio');

var controller = {

    saveData: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;

        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }
        //DATOS QUE VIENE DESDE POST
        var tipo_serv = req.body.tipo_servicio;

        try {
            var validate_tipo_serv = !Validator.isEmpty(tipo_serv);

            if (!validate_tipo_serv) {

                return res.status(400).send({
                    status: "error",
                    message: "El campo tipo de servicio esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: error
            });
        }

        var resultfind = findT_servicio( tipo_serv.toUpperCase() );

        resultfind.then(tipoServicioEnc => {

            if (tipoServicioEnc.length == 0) {

                //================================================
                var resultado = guardarTipoServicio(tipo_serv.toUpperCase());

                resultado.then(t_serv => {

                    return res.status(200).send({
                        status: "success",
                        message: t_serv
                    });

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: error
                    });
                });
                //==================================================
            }

            if (tipoServicioEnc) {

                if (tipoServicioEnc.length > 0) {

                    return res.status(409).send({
                        status: "duplicado",
                        message: "El tipo de servicio ya existe"
                    });
                }
            }

        }).catch(error => {
            return res.status(500).send({
                status: "error",
                message: "Error al buscar el tipo de servicio "+ error
            });
        });

    },

    updateTipoServicio: ( req, res ) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        var _id_linea = req.params._id;
        var tipo_servicio = req.body.tipo_servicio;

        //Validar datos
        try {

            var validate_tipo_servicio = !Validator.isEmpty(tipo_servicio);

            if (!validate_tipo_servicio) {

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
        let resultado = findTipoServcioExist(tipo_servicio.toUpperCase());

        resultado.then(list_linea => {

            if (list_linea.length == 0) {

                //===================================================================

                //Actualizar datos
                let resultUpdateNegocio = updateTipoServicio ( _id_linea , tipo_servicio.toUpperCase() );

                resultUpdateNegocio.then(resultlinea => {

                    if (resultlinea) {
                        return res.status(200).send({
                            status: "success",
                            message: resultlinea
                        });
                    }

                    if (!resultlinea) {
                        return res.status(404).send({
                            status: "success",
                            message: "f"
                        });
                    }

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al actualizar la linea del producto "+ error
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
                status: "err",
                message: err
            });
        });
    },

    search_all_tipo_servicio : (req , res )=>{
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        let resultFind = TipoServicio.find().sort({tipo_servicio:1});

        resultFind.then(result => {

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
                message: "Error al buscar el tipo de servicio " + err
            });
        });

    },

    searchTipoServicio: (req, res) => {
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        var tipo_servicio_body = req.body.tipo_servicio;

        try {
            var validate_tipo_servicio = !Validator.isEmpty(tipo_servicio_body);

            if(!validate_tipo_servicio){
                return res.status(400).send({
                    status: "error",
                    message: "El campo tipo de servicio esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Faltan datos " + error
            });
        }

        var listaEncontrados = [];
        let resultTipoServicio = TipoServicio.find().sort({tipo_servicio:1});

        resultTipoServicio.then(result => {

            if (result.length > 0) {

                result.forEach((productos, index, data) => {

                    let tipo_servicio_enc = productos['tipo_servicio'];

                    let existeValor = tipo_servicio_enc.includes(tipo_servicio_body.toUpperCase());

                    if (existeValor) {
                       
                        listaEncontrados.push(productos);
                    }
                    
                });

                return res.status(200).send({
                    status: "success",
                    message: listaEncontrados
                });

            }

            if(result.length==0){
                return res.status(404).send({
                    status: "vacio",
                    message: "El tipo de servicio no se encontro"
                });
            }

        }).catch(err =>{
            return res.status(500).send({
                status: "error",
                message: "Error al buscar el tipo de servicio "+ err
            });
        });
    }
};

async function guardarTipoServicio(T_servicioInsert) {

    let tipoServicioInsert = new TipoServicio({
        tipo_servicio: T_servicioInsert
    });

    return await tipoServicioInsert.save();
}

async function updateTipoServicio( _id , tipo_servicio_update) {

    let tipoServicioUpdate = await TipoServicio.findByIdAndUpdate( _id ,
        {
            $set: {
                tipo_servicio: tipo_servicio_update,
            }

        }, { new: true }
    );

    return tipoServicioUpdate;
}

async function findT_servicio(t_servicio) {
    let resultT_servicio = await TipoServicio.find({ tipo_servicio: t_servicio });

    return resultT_servicio;
}

async function findTipoServcioExist(_tipo_servicio) {

    let resultTipoServicio = await TipoServicio.find({ tipo_servicio: _tipo_servicio }).select({ _id: 1 });

    return resultTipoServicio;
}

module.exports = controller;