'use strict'
const Negocio = require('../models/negocio');

var controller = {

    saveComentario: (req, res) => {

        console.log( "Guardando datos " , req.negocio_autentificado);
        const _idusuario =  req.negocio_autentificado._id;

        const _idnegocio = req.params._idnegocio;
        const _idproducto = req.params._idproducto;

        const nameTbl = req.body.nameTbl;
        const titulo_comentario = req.body.titulo_comentario;
        const comentario = req.body.comentario;
        const estrellas = req.body.estrellas;

        const datos_producto = {
            _idusuario: _idusuario,
            titulo_comentario: titulo_comentario,
            comentario: comentario,
            estrellas: estrellas,
        };

        let resultSave = saveComentario( _idnegocio , nameTbl , _idproducto , datos_producto );
        
        resultSave.then(result => { 
            
            return res.status(200).send({
                status: "success",
                message: result
            });

        }).catch(err => {
            return res.status(200).send({
                status: "error",
                message: err
            });
        });
    }
}

/**
 * GUARDA UN COMENTARIO SOBRE EL PRODUCTO
 * @param {*} _idNegocio ID DEL NEGOCIO
 * @param {*} tbl           SOBRE QUE TIPO DE PRODUCTO SE DESEA AGREGAR EL COMENTARIO => ABARROTE , ZAPATOS , ROPA, ETC
 * @param {*} _idProducto   ID DEL PRODUCTO
 * @param {*} data_comentario 
 */
async function saveComentario(_idNegocio, nameTblSearch, _idProducto, data_comentario) {

    let opc1 = nameTblSearch + ".$[prod].comentarios";

    const comentarioInsert = await Negocio.update(
        { "_id": { $eq: _idNegocio } },
        { $push: { [opc1]: data_comentario } },
        {
            arrayFilters: [{ "prod._id": { $eq: _idProducto } }]
        });

    return comentarioInsert;
}

module.exports = controller;