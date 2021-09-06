'use strict'
const Negocio = require('../models/negocio');

var controller = {

    saveComentario: (req, res) => {
        const _idusuario = req.negocio_autentificado._id;

        const _idnegocio = req.params._idnegocio;
        const _idproducto = req.params._idproducto;

        const nameTbl = req.body.nameTbl;
        const titulo_comentario = req.body.titulo_comentario;
        const comentario = req.body.comentario;
        const estrellas = req.body.estrellas;

        let listaGroseria = ['Bestia','Asno','Burro','buey','Tonto','zonzo','bobo','baboso','Torpe','idiota','vagina',
        'imbécil','estúpido','estúpida','mentecato','papanatas','Zoquete','tarugo','tarado','pendejo','Miseria','cocho',
        'Fracasado','Caca','Pedo','pinche','cabrón','loco','cobarde','maricón','puto','puta','huevón','podrido','podrida',
        'boludo','mequetrefe','ignorante','Incompetente','Ridículo','bastardo','Mamón','insolente','maldito','maldita',
        'Maldición','Mierda','Púdrete','chinga tu madre','coger', 'joto','huevon','mamadas','gey','wey','cabezon', 'cabeza hueca','madrear'];

        for (let i = 0; i < listaGroseria.length; i++) {
            // Esto lo que hace es obtener la palabra i del array (input)
            let palabraActual = listaGroseria[i];
            // Aquí comprobamos que exista la palabra en el array, ya que si no existe, devuevlve -1
            let er = new RegExp(palabraActual, 'i');
            if (er.test(titulo_comentario) || er.test(comentario)) {
                return res.status(200).send({
                    status: "groseria",
                    message: "No puede decir "+ palabraActual + " sobre este producto."
                });
            }
        }

        const datos_producto = {
            _idusuario: _idusuario,
            titulo_comentario: titulo_comentario,
            comentario: comentario,
            estrellas: estrellas,
        };

        let resultSave = saveComentario(_idnegocio, nameTbl, _idproducto, datos_producto);

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