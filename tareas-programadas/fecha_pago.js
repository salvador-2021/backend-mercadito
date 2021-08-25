const cron = require('node-cron');
const Negocio = require('../models/negocio');

async function mongodb() {
    //OBTENEMOS LA FECHA ACTUAL
    const fecha = new Date();
    //ACTUALIZAMOS LOS NEGOCIOS QUE TIENEN UNA FECHA ANTERIOR A LA FECHA ACTUAL

    /*estado: true,
                estado_pag: true,
                fecha_pago: fechaMasUnMes, //ESTE CODIGO SE VA A CAMBIAR DESPUES */
    let updateStatusNegocio = await Negocio.updateMany(
        { "fecha_pago": { $lte: fecha } },
        { $set: { estado: false , estado_pag:false } }
    );

    return updateStatusNegocio;
}

let tarea = cron.schedule('0 23 * * *', (data) => {

    let respuestaMongo = mongodb();
    respuestaMongo.then(negocios => {
        if (!negocios) {
            console.log("No encontrados");
        }
        if (negocios) {
            console.log("encontrados", negocios);
        }
    }).catch(err => {
        console.log(err);
    });

}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

module.exports = tarea;