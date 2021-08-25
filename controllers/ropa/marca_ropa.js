'use strict'
const Validator = require('validator');
const MarcaRopa = require('../../models/ropa/marca_ropa');

var controller = {

    saveMarca: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;

        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        //DATOS QUE VIENE DESDE POST
        var marca = req.body.marca;

        try {

            var validate_marca = !Validator.isEmpty(marca);

            if (!validate_marca) {

                return res.status(400).send({
                    status: "error",
                    message: "El valor marca esta vacio"
                });
            }

        } catch (error) {
            return res.status(400).send({
                status: "error",
                message: error
            });
        }

        var resultfind = findMarca(marca.toUpperCase());

        resultfind.then(marcaEnc => {

            if (marcaEnc.length == 0) {

                //================================================
                var resultado = guardarMarca(marca.toUpperCase());

                resultado.then(marca => {

                    return res.status(200).send({
                        status: "success",
                        message: marca
                    });

                }).catch(error => {
                    return res.status(500).send({
                        status: "error",
                        message: error
                    });
                });
                //==================================================
            }

            if (marcaEnc) {

                if (marcaEnc.length > 0) {

                    return res.status(409).send({
                        status: "duplicado",
                        message: "La marca de la ropa ya existe"
                    });
                }
            }

        }).catch(error => {
            return res.status(500).send({
                status: "error",
                message: "Error al buscar la marca de la ropa" + error
            });
        });

    },

    updateMarca: (req, res) => {

        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        var _id_marca = req.params._id;
        var marcabody = req.body.marca;

        //Validar datos
        try {

            var validate_marca = !Validator.isEmpty(marcabody);

            if (!validate_marca) {

                return res.status(400).send({
                    status: "error",
                    message: "El campo marca esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Faltan datos"
            });
        }

        //VERIFICAR EL NOMBRE Y CORREO NO SE DUPLIQUE
        let resultado = findMarcaExist(marcabody.toUpperCase());

        resultado.then(list_marca => {


            if (list_marca.length == 0) {

                //===================================================================

                //Actualizar datos
                let resultUpdateNegocio = updateMarca(_id_marca, marcabody.toUpperCase());

                resultUpdateNegocio.then(resultlinea => {

                    if (resultlinea) {
                        return res.status(200).send({
                            status: "success",
                            message: resultlinea
                        });
                    }

                    if (!resultlinea) {
                        return res.status(404).send({
                            status: "Error",
                            message: "Error al actualizar la marca"
                        });
                    }

                }).catch(error => {
                    return res.status(200).send({
                        status: "error",
                        message: "Error al actualizar la marca" + error
                    });
                });

            } else if (list_marca.length == 1) {

                var idEncontrado = list_marca[0]["_id"];

                if (idEncontrado == _id_marca) {

                    return res.status(200).send({
                        status: "success",
                        message: "Dato actualizado"
                    });

                } else {

                    return res.status(409).send({
                        status: "duplicado",
                        message: "La marca de la ropa ya existe!"
                    });
                }

            } else if (list_marca.length >= 2) {

                return res.status(409).send({
                    status: "duplicado",
                    message: "La marca de la ropa ya existe!"
                });

            }

        }).catch(err => {
            return res.status(500).send({
                status: "error",
                message: err
            });
        });
    },

    search_all_marca : (req , res )=>{
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        let resultMarca = MarcaRopa.find().sort({linea:1});

        resultMarca.then(result => {

            if (result.length > 0) {
                return res.status(200).send({
                    status: "success",
                    message: result
                });
            }

            if(result.length==0){
                return res.status(404).send({
                    status: "Vacio",
                    message: "Lista vacia"
                });
            }

        }).catch(err =>{
            return res.status(400).send({
                status: "error",
                message: "Error al buscar la marca de la ropa " + err
            });
        });
    },

    searchMarca: (req, res) => {
        //VALIDAMOS QUE SEA UN USUARIO ADMINISTRADOR
        const tipoUser = req.usuario_autentificado.tipo;
        if (tipoUser != 'ADMINISTRADOR') {
            return res.status(401).send({
                status: "error",
                message: "Usuario no identificado"
            });
        }

        var marcaB = req.body.marca;
        try {
            var validate_marca = !Validator.isEmpty(marcaB);
            if(!validate_marca){
                return res.status(400).send({
                    status: "error",
                    message: "El valor marca de la ropa esta vacio"
                });
            }

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Faltan valores"
            });
        }

        var listaEncontrados = [];
        let resultMarca = MarcaRopa.find().sort({marca:1});

        resultMarca.then(result => {

            if (result.length > 0) {

                
                result.forEach((marcas_encontrado, index, data) => {
                
                    let marca_enc = marcas_encontrado['marca'];

                    let existeValor = marca_enc.includes(marcaB.toUpperCase());

                    if (existeValor) {
                       
                        listaEncontrados.push(marcas_encontrado);
                    }
                });

                if(listaEncontrados.length==0){

                    return res.status(404).send({
                        status: "Vacio",
                        message: "La marca de la ropa no existe"
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
                    message: "Marca de la ropa no encontrado"
                });
            }

        }).catch(err =>{
            return res.status(500).send({
                status: "error",
                message: "Error al buscar la marca de la ropa " + err
            });
        });
    }
};

async function guardarMarca(marcaInsert) {

    let marca_Insert = new MarcaRopa({
        marca: marcaInsert
    });

    return await marca_Insert.save();
}

async function updateMarca(_id, marca) {

    let marca_Update = await MarcaRopa.findByIdAndUpdate(_id,
        {
            $set: {
                marca: marca,
            }
        }, { new: true }
    );

    return marca_Update;
}

async function findMarca(marcaB) {
    let resultMarca = await MarcaRopa.find({ marca: marcaB });

    return resultMarca;
}

async function findMarcaExist(marcaB) {

    let resultMarca = await MarcaRopa.find({ marca: marcaB }).select({ _id: 1 });

    return resultMarca;
}

module.exports = controller;