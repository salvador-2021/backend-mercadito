'use strict'
const Negocio = require('../../models/negocio');
const Usuario = require('../../models/usuario');
const fs = require('fs');//ELIMINAR ARCHIVOS CON PROMESAS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS

var controller = {

    delete_negocio: (req, res) => {

        const _idnegocio = req.params._id;

        Negocio.findOneAndDelete({ _id: _idnegocio }, (err, negocioRemoved) => {
            if (err) {
                return res.status(500).send(
                    {
                        status: "error",
                        message: "Datos no eliminado, posiblemente no existe el registro"
                    }
                );
            }

            if (!negocioRemoved) {
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
                    message: "Datos eliminados"
                }
            );

        });
    },
    delete_file_negocio: (req, res) => {

        const _idnegocio = req.params._id;
        const rutaArchivoEliminar = '../../uploads/' + _idnegocio;

        let pathJoin = path.join(__dirname, rutaArchivoEliminar);

        eliminarFolderNegocio(pathJoin).then(respuestaEliminacion => {

            if (respuestaEliminacion == "DIRECTORIO_ELIMINADO") {
                return res.status(200).send(
                    {
                        status: "success",
                        message: respuestaEliminacion
                    }
                );

            } else {
                return res.status(500).send(
                    {
                        status: "error",
                        message: "Hubo un problema con el servidor"
                    }
                );
            }
        });

        //deleteFolder(pathJoin);

    },
    getListNegocio: (req, res) => {

        const estadoParam = req.params._estado;
        Negocio.find().
            and({ estado: estadoParam }).
            sort({ "nombre": 1 }).
            exec((err, negocios) => {
                if (err) {
                    return res.status(500).send(
                        {
                            status: "error",
                            message: "Hubo un problema con el servicos"
                        }
                    );
                }

                if (!negocios) {
                    return res.status(200).send(
                        {
                            status: "vacio",
                            message: "No hay registros"
                        }
                    );
                }
                if (negocios.length == 0) {
                    return res.status(200).send(
                        {
                            status: "vacio",
                            message: "No hay registros"
                        }
                    );
                }

                return res.status(200).send(
                    {
                        status: "success",
                        message: negocios
                    }
                );
            });
    },
    updateStatusNegocio: (req, res) => {
        const idnegocio = req.params._id;
        const estadoParam = req.body.estado;

        let resultUpdate = updateStatusNegocio(idnegocio, estadoParam);

        resultUpdate.then(negocioUpdate => {

            if (!negocioUpdate) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Hubo un problema al actualizar el registro"
                });
            }

            return res.status(200).send({
                status: "success",
                message: negocioUpdate
            });

        }).catch(error => {
            return res.status.send({
                status: "error",
                message: error
            });
        });
    },

    updatePagoMesNegocio: (req, res) => {
        const montoParams = req.body.monto;

       let updatePagoMes =  updatePagoMesNegocio(montoParams);
        updatePagoMes.then(negocios => {
            if(!negocios){
                return res.status(404).send(
                    {
                        status: "vacio",
                        message: "Hubo un problema con el servidor al intentar actualizar"
                    }
                );
            }
            if(negocios){
                return res.status(200).send(
                    {
                        status: "success",
                        message: "Monto actualizaco"
                    }
                );
            }
        }).catch(err => {
            return res.status(500).send(
                {
                    status: "error",
                    message: "Hubo un problema con el servidor al intentar actualizar" + err
                }
            );
        });

    },
    getListUsuario:(req, res)=>{
        const estadoParam = req.params._estado;

        Usuario.find().
        and({ estado: estadoParam , tipo:"usuario"}).
        sort({ "nombre": 1 }).
        exec((err, usuarios) => {
            if (err) {
                return res.status(500).send(
                    {
                        status: "error",
                        message: "Hubo un problema con el servidor"
                    }
                );
            }

            if (!usuarios) {
                return res.status(200).send(
                    {
                        status: "vacio",
                        message: "No hay registros"
                    }
                );
            }

            if (usuarios.length == 0) {
                return res.status(200).send(
                    {
                        status: "vacio",
                        message: "No hay registros"
                    }
                );
            }

            return res.status(200).send(
                {
                    status: "success",
                    message: usuarios
                }
            );
        });
    },
    delete_usuario: (req, res) => {

        const _idusuario = req.params._id;
        Usuario.findOneAndDelete({ _id: _idusuario }, (err, negocioRemoved) => {
            if (err) {
                return res.status(500).send(
                    {
                        status: "error",
                        message: "Datos no eliminado, posiblemente no existe el registro"
                    }
                );
            }

            if (!negocioRemoved) {
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
                    message: "Datos eliminados"
                }
            );

        });
    },
    updateStatusUsuario: (req, res) => {
        const idusuario = req.params._id;
        const estadoParam = req.body.estado;

        let resultUpdate = updateStatusUsuario(idusuario, estadoParam);

        resultUpdate.then(negocioUpdate => {

            if (!negocioUpdate) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Hubo un problema al actualizar el registro"
                });
            }

            return res.status(200).send({
                status: "success",
                message: negocioUpdate
            });

        }).catch(error => {
            return res.status.send({
                status: "error",
                message: error
            });
        });
    }

};


//===============================================================================================
function deleteFolder(path) {
    //SE CREA UNA PROMESA
    return new Promise(resolve => {
        //SE RESUELVE EL PROBLEMA
        let files = [];
        if (fs.existsSync(path)) {

            files = fs.readdirSync(path); //LECTURA DEL CONTENIDO
            files.forEach(function (file, index) {
                let curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    deleteFolder(curPath);
                } else {
                    fs.unlinkSync(curPath); //ELIMINACION DE ARCHICOS
                }
            });
            fs.rmdirSync(path); //ELIMINACION DE CARPETA SI ESTA VACIO
            //DEVOLVEMOS UNA RESPUESTA
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

///===================================================================================
async function updateStatusNegocio(_id, status) {
    let NegocioUpdate = await Negocio.findByIdAndUpdate(_id,
        {
            $set: {
                estado: status
            }
        }, { new: true }
    );
    return NegocioUpdate;
}

async function updateStatusUsuario(_id, status) {
    let usuarioUpdate = await Usuario.findByIdAndUpdate(_id,
        {
            $set: {
                estado: status
            }
        }, { new: true }
    );
    return usuarioUpdate;
}
async function updatePagoMesNegocio(monto) {
    //"monto_mensual" : 100,
    let updateStatusNegocio = await Negocio.updateMany(
        { $set: { monto_mensual:monto } }
    );
    return updateStatusNegocio;
}

module.exports = controller;

