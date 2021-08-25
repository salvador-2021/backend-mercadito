'use strict'
const Negocio = require('../../models/negocio');
const Pagos = require('../../models/pagos');
const stripe = require('stripe')("sk_test_51J7MsxEt2hEwGuA9YkTwSZ7hhA7RuV6NUnAvT52HmXYdUjDf5IfAsCibFdZWJsHQuXtvGi3aBE4CUmoAuosw5jp200dkohXiNa");
var controller = {

    savePago: async (req, res) => {
        var datosNegocio = req.negocio_autentificado;

        const stripeToken = req.body.stripeToken;
        const monto = req.body.monto;
        const descripcionPago = req.body.descripcion;
        const nombreCliente = req.body.nombreCliente;
        const monedaMexicana = Math.round(monto * 100);

        const chargeObject = await stripe.charges.create({
            amount: monedaMexicana,
            currency: 'MXN',
            source: stripeToken,
            capture: false,
            description: descripcionPago,
            receipt_email: datosNegocio.correo
        });

        try {
            //SE CAPTURA EL PAGO EN STRIPE
            await stripe.charges.capture(chargeObject.id);

            //SE GUARDA LOS DATOS DEL PAGO EN LA COLECCION DEL PROPIO NEGOCIO
            let datosPago1 = {
                nombre_cliente: nombreCliente,
                monto: monto,
                id_card :chargeObject.id 
            }

            var insertDataNegocio = agregaPago(datosNegocio._id, datosPago1);

            insertDataNegocio.then(insertData => {

                if (!insertData) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Hubo un problema con la actualizacion del pago"
                    });
                }

            }).catch(err => {
                return res.status(500).send({
                    status: "error",
                    message: err
                });
            });

             //=============ACTUALIZAMOS ESTADO DE PAGO DEL NEGOCIO=========================================

            let updateNegocio = updateStatusPagoNegocio(datosNegocio._id);
            updateNegocio.then(update => {
                if (!update) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Hubo un problema con la actualizacion del pago"
                    });
                }
            }).catch(err => {
                return res.status(500).send({
                    status: "error",
                    message: err
                });
            });

            //============================================================================================

            //SE GUARDA LOS DATOS DEL PAGO EN LA COLECCION DE PAGOS
            let datosPago2 = {
                _idnegocio: datosNegocio._id,
                nombre_cliente: nombreCliente,
                descripcion: descripcionPago,
                monto: monto,
                id_card :chargeObject.id 
            }

            var insertDataPagos = guarPago(datosPago2);
            insertDataPagos.then(insertData => {

                if (!insertData) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Hubo un problema con la actualizacion del pago"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: chargeObject
                });
            });

        } catch (error) {
            await stripe.refunds.create({ charge: chargeObject.id });

            return res.status(500).send({
                status: "error",
                message: chargeObject
            });
        }
    }
}


/**
 * SE AGREGA UN REGISTRO DE PAGO EN LA COLECCION DE NEGOCIO
 * @param {*} _idNegocio 
 * @param {*} datos 
 */
async function agregaPago(_idNegocio, datos) {

    let productInsert = await Negocio.updateOne({ _id: _idNegocio }, {
        $push: {
            'pagos': datos
        }
    }, { new: true });

    return productInsert;
}

/**
 * SE ACTUALIZA EN ESTADO DE PAGO
 * @param {*} _idNegocio 
 */
async function updateStatusPagoNegocio(_idNegocio) {

    //CUADO SE ACTUALICE EL NEGOCIO, ESTARA ACTIVADO POR 1 MESES
    const fechaMasUnMes = new Date();
    fechaMasUnMes.setMonth(fechaMasUnMes.getMonth() + 1);

    let NegocioUpdate = await Negocio.findByIdAndUpdate(_idNegocio,
        {
            $set: {
                estado: true,
                estado_pag: true,
                fecha_pago: fechaMasUnMes, //ESTE CODIGO SE VA A CAMBIAR DESPUES
            }
        }, { new: true }
    );

    return NegocioUpdate;
}

/**
 * SE AGREGA UN REGISTRO DE PAGO EN LA COLECCION DE PAGOS
 * @param {*} data 
 */
async function guarPago(data) {
    let pagoInsert = new Pagos(data);

    return await pagoInsert.save();
}

module.exports = controller;

