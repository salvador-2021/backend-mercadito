'use strict'

const Negocio = require('../models/negocio');
var fs = require('fs');//PARA ELIMINAR ARCHIVOS
var path = require('path'); //PARA OBTENER LAS RUTAS DE LAS CARPETAS


var controller = {
    busqueda_general_producto: (req, res) => {
        //2 .-RECUPERA TODOS LOS PRODUCTO QUE COINCIDAN CON EL NOMBRE 
        var nombrebody = req.params.nombre_producto;
        console.log("busqueda general");
        var queryMongo = "";

        queryMongo = Negocio.find().or([
            { "abarrote.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "abarrote.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "alimento.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "alimento.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "accesorio_movil.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "accesorio_movil.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "bicicleta.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "bicicleta.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "bodega.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "bodega.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "computadora.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "celular.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "celular.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "cerrajeria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "cerrajeria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "cama.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "cama.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "carpinteria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "carpinteria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "carniceria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "carniceria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "construccion.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "construccion.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "dentista.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "dentista.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "fruteria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "fruteria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "farmacia.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "farmacia.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "fotos.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "fotos.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "ferreteria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "ferreteria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "fierro.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "fierro.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "floreria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "floreria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "funeraria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "funeraria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "herreria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "herreria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "hivernadero.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "joyeria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "joyeria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "licuadora.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "licuadora.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "muebleria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "muebleria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "microonda.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "microonda.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "moto.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "moto.marca": { "$regex": nombrebody, "$options": "i" } },
            { "optica.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "optica.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "plomeria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "plomeria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "papeleria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "papeleria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "pintura.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "pintura.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "plancha.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "plancha.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "relojeria.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "relojeria.descripcion": { "$regex": nombrebody, "$options": "i" } },
            
            { "ropas.tipo_ropa": { "$regex": nombrebody, "$options": "i" } },
            { "ropas.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "ropas.descripcion": { "$regex": nombrebody, "$options": "i" } },
            
            { "refrigerador.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "refrigerador.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "servicios.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "servicios.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "tela.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "tela.tipo_tela": { "$regex": nombrebody, "$options": "i" } },
            { "television.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "television.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "veladora.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "veladora.descripcion": { "$regex": nombrebody, "$options": "i" } },
            { "zapatos.nombre": { "$regex": nombrebody, "$options": "i" } },
            { "zapatos.descripcion": { "$regex": nombrebody, "$options": "i" } }
        ]);

        var listaProductoEncontrados = [];

        queryMongo.exec((err, lista) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Producto no encontrado"
                });
            }

            if (!lista) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            if (lista.length == 0) {

                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            lista.forEach((dataList, index, data) => {

                //==========================================================================
                var _idNegocio = lista[index]._id;

                dataList['abarrote'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "abarrote",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================

                _idNegocio = lista[index]._id;
                dataList['alimento'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "alimento",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['accesorio_movil'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "accesorio_movil",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['bicicleta'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "bicicleta",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['bodega'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "bodega",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['computadora'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre)) {
                        listaProductoEncontrados.push({
                            nameTable: "computadora",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;
                dataList['celulares'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "celulares",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['cerrajeria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "cerrajeria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['cama'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "cama",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['carpinteria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "carpinteria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['carniceria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "carniceria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });


                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['construccion'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "construccion",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['dentista'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "dentista",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['fruteria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "fruteria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['farmacia'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "farmacia",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['fotos'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "fotos",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['ferreteria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "ferreteria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['fierro'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "fierro",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;
                dataList['floreria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "floreria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['funeraria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "funeraria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['herreria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "herreria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });


                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['hivernadero'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "hivernadero",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['joyeria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "joyeria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['licuadora'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "licuadora",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['muebleria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "muebleria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['microonda'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "microonda",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['moto'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.marca)) {
                        listaProductoEncontrados.push({
                            nameTable: "moto",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['optica'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "optica",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });


                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['plomeria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "plomeria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['papeleria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "papeleria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['pintura'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "pintura",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['plancha'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "plancha",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['relojeria'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "relojeria",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['ropas'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion) || er.test(producto.tipo_ropa)) {
                        listaProductoEncontrados.push({
                            nameTable: "ropas",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['refrigerador'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "refrigerador",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['servicios'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "servicios",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['tela'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.tipo_tela)) {
                        listaProductoEncontrados.push({
                            nameTable: "tela",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['television'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "television",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['veladora'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "veladora",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });


                //==========================================================================
                _idNegocio = lista[index]._id;

                dataList['zapatos'].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: "zapatos",
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });

                //==========================================================================
            }
            );

            if (listaProductoEncontrados.length == 0) {

                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });

            }

            listaProductoEncontrados.sort((a, b) => {
                var textA = a.data.precio;
                var textB = b.data.precio;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            //console.log(listaProductoEncontrados);
            return res.status(200).send({
                status: "success",
                message: listaProductoEncontrados
            });

        });

    },
    getAllProductoNegocioById: (req, res) => {
        //1.- RECUPERA TODOS LOS PRODUCTOS QUE LE PERTENECE A NEGOCIO EN ESPECIFICO INDICANDO EL _ID DEL NEGOCIO
        //ID DEL NEGOCIO
        var _idNegocio = req.params._idnegocio;

        //LISTA DE LINEAS DE PRODUCTOS QUE OFRECE EL NEGOCIO
        let listaLinea = [];
        let queryObtenido = req.query;
        if (queryObtenido.linea1) {
            listaLinea.push(queryObtenido.linea1);
        }
        if (queryObtenido.linea2) {
            listaLinea.push(queryObtenido.linea2);
        }


        var queryMongo = Negocio.findById({ _id: _idNegocio });

        var listaProductoEncontrados = [];

        queryMongo.exec((err, lista) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Producto no encontrado"
                });
            }

            if (!lista) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            if (lista.length == 0) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            listaLinea.forEach(linea => {

                lista[linea].forEach((producto, index, data) => {

                    listaProductoEncontrados.push({
                        nameTable: linea,
                        _id: _idNegocio,
                        data: producto
                    });
                });
            });

            //==========================================================================

            return res.status(200).send({
                status: "success",
                message: listaProductoEncontrados
            });

        });
    },
    findProductNegocio: (req, res) => {
        const _idNegocio = req.params._idnegocio;
        const nombrebody = req.params._nombre;
        console.log("nombre body", nombrebody)

        //LISTA DE LINEAS DE PRODUCTOS QUE OFRECE EL NEGOCIO
        let listaLinea = [];
        let queryObtenido = req.query;
        if (queryObtenido.linea1) {
            listaLinea.push(queryObtenido.linea1);
        }
        if (queryObtenido.linea2) {
            listaLinea.push(queryObtenido.linea2);
        }

        var queryMongo = Negocio.findOne({ _id: _idNegocio });

        console.log("Cantidad de linea del negocio", listaLinea.length);
        console.log("linea", listaLinea[0]);

        if (listaLinea.length == 1) { //si el negocio manega 1 linea
            let nombreLinea = listaLinea[0];
            let table1 = listaLinea[0] + ".nombre";
            let table11 = listaLinea[0] + ".descripcion";

            queryMongo.or([
                { [table1]: { "$regex": nombrebody, "$options": "i" } },
                { [table11]: { "$regex": nombrebody, "$options": "i" } }]).select({ [nombreLinea]: 1, _id: 1 });

        } else if (listaLinea.length == 2) { //si el negocio manega dos lineas
            let nombreLinea1 = listaLinea[0];
            let nombreLinea2 = listaLinea[1];

            let table1 = listaLinea[0] + ".nombre";
            let table11 = listaLinea[0] + ".descripcion";

            let table2 = listaLinea[1] + ".nombre";
            let table22 = listaLinea[1] + ".descripcion";

            queryMongo.or([
                { [table1]: { "$regex": nombrebody, "$options": "i" } },
                { [table11]: { "$regex": nombrebody, "$options": "i" } },
                { [table2]: { "$regex": nombrebody, "$options": "i" } },
                { [table22]: { "$regex": nombrebody, "$options": "i" } }]).select({ [nombreLinea1]: 1, [nombreLinea2]: 1, _id: 1 })
        }

        var listaProductoEncontrados = [];

        queryMongo.exec((err, lista) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Producto no encontrado"
                });
            }

            if (!lista) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            if (lista.length == 0) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            listaLinea.forEach(linea => {

                lista[linea].forEach((producto, index, data) => {

                    let er = new RegExp(nombrebody, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {
                        listaProductoEncontrados.push({
                            nameTable: linea,
                            _id: _idNegocio,
                            data: producto
                        });
                    }
                });
            });

            listaProductoEncontrados.sort((a, b) => {
                var textA = a.data.precio;
                var textB = b.data.precio;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            return res.status(200).send({
                status: "success",
                message: listaProductoEncontrados
            });

        });
    },
    getDataByIdNegocioIdProducto: (req, res) => {
        /*RECUPERA LOS DATOS DE UN PRODUCTO EN ESPECIFICO INDICANDO EL ID DEL PRODUCTO Y SEGUN EL ARRAY (Abarrote, optica, etc) QUE PERTENECE */
        const nameTblSearch = req.params.nameTblSearch;
        const _idproducto = req.params._idproducto;

        let opc1 = nameTblSearch + "._id";
        let opc2 = nameTblSearch + ".$";

        //FUNCIONA
        Negocio.findOne({ [opc1]: _idproducto }, { [opc2]: 1 }).exec((err, listProducto) => {

            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: "error",
                    message: "Producto no encontrado " + err
                });
            }

            if (!listProducto) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            if (listProducto.length == 0) {
                return res.status(404).send({
                    status: "No encontrado",
                    message: "Producto no encontrado"
                });
            }

            return res.status(200).send({
                status: "success",
                message: listProducto
            });
        });
    },
    getImageByIdNegocioNameTable: (req, res) => {
        /*RECUPERA LA IMAGEN SEGUN AL ARRAY (ABARROTE, OPTICA, ETC) QUE PERTENECE */
        const _idNegocio = req.params._idNegocio;
        const nameTblSearch = req.params.nameTblSearch;
        const nameImage = req.params.nameImage;

        var path_file = './uploads/' + _idNegocio + '/' + nameTblSearch + '/' + nameImage;

        fs.exists(path_file, (exists) => {

            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe!!'
                });
            }
        });
    },
    getAllProductByTable: (req, res) => {
        //BUSCA LOS PRODUCTOS SEGUN SEA EL ARRAYMONGO (abarrote, optica etc) E INDICANDO EL NOMBRE DEL PRODUCTO
        const nombreproducto = req.params.nameProduct;
        const nombreTbl = req.params.nameTblSearch;

        let opc1 = nombreTbl + ".nombre";
        let opc2 = nombreTbl + ".descripcion";

        var queryMongo;

        queryMongo = Negocio.find().or([
            { [opc1]: { "$regex": nombreproducto, "$options": "i" } },
            { [opc2]: { "$regex": nombreproducto, "$options": "i" } },
        ]);

        var listaProductoEncontrados = [];

        queryMongo.exec((err, lista) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Producto no encontrado"
                });
            }

            if (!lista) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            if (lista.length == 0) {
                return res.status(200).send({
                    status: "vacio",
                    message: "Producto no encontrado"
                });
            }

            lista.forEach((dataList, index, data) => {

                var _idNegocio = lista[index]._id;

                dataList[nombreTbl].forEach((producto, index, data) => {

                    let er = new RegExp(nombreproducto, 'i')
                    if (er.test(producto.nombre) || er.test(producto.descripcion)) {

                        let dataProducto = [{
                            nameTable: nombreTbl,
                            _id: _idNegocio,
                            data: producto
                        }];

                        listaProductoEncontrados.push(dataProducto);
                    }
                });
            });

            
            return res.status(200).send({
                status: "success",
                message: listaProductoEncontrados
            });

        });
    },
    busquedaFiltroRopa: (req, res) => {
        /*BUSQUEDA DE LOS PRODUCTOS QUE TENGAN UNA LINEA EN ESPECIFICO*/
        //DATOS QUE VIENEN POR POST

        const nombreProducto = req.query.nombreProducto;
        const producto_genero = req.query.genero;
        const producto_talla = req.query.talla;
        const producto_marca = req.query.marca;
        const producto_color = req.query.color;

        var listaProductoEncontrados = [];

        Negocio.find().
            and([{ estado: true }, { "ropas.estado": true }]).
            or([{ "ropas.nombre": { "$regex": nombreProducto, "$options": "i" } },
            { "ropas.genero": { "$regex": producto_genero, "$options": "i" } },
            { "ropas.tallas": { talla: producto_talla } },
            { "ropas.marca": { "$regex": producto_marca, "$options": "i" } },
            { "ropas.colores": { color: producto_color } }]).
            select({ ropas: 1, _id: 1 }).
            sort({ "ropas.precio": 1 }).
            exec((err, listProducto) => {

                if (err) {
                    console.log("error", err);
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado " + err
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                listProducto.forEach((dataList, index, data) => {

                    var _idNegocio = listProducto[index]._id;

                    dataList["ropas"].forEach((producto, index, data) => {

                        let dataProducto = {
                            nameTable: "ropas",
                            _id: _idNegocio,
                            data: producto
                        };

                        listaProductoEncontrados.push(dataProducto);

                    });
                });

                console.log(listaProductoEncontrados);

                return res.status(200).send({
                    status: "success",
                    message: listaProductoEncontrados
                });
            });
    },
    busquedaFiltroZapatos: (req, res) => {
        /*BUSQUEDA DE LOS PRODUCTOS QUE TENGAN UNA LINEA EN ESPECIFICO*/
        //DATOS QUE VIENEN POR POST
        const nombreProducto = req.query.nombreProducto;
        const producto_genero = req.query.genero;
        const producto_talla = req.query.talla;
        const producto_marca = req.query.marca;
        const producto_color = req.query.color;

        Negocio.find().
            and([{ estado: true }, { "zapatos.estado": true }]).
            or([{ "zapatos.nombre": { "$regex": nombreProducto, "$options": "i" } },
            { "zapatos.descripcion": { "$regex": nombreProducto, "$options": "i" } },
            { "zapatos.genero": { "$regex": producto_genero, "$options": "i" } },
            { "zapatos.tallas": { talla: producto_talla } },
            { "zapatos.marca": { "$regex": producto_marca, "$options": "i" } },
            { "zapatos.colores": { color: producto_color } }]).
            select({ zapatos: 1, _id: 1 }).
            sort({ "zapatos.precio": 1 }).
            exec((error, listProducto) => {

                if (error) {
                    console.log("error", error);
                    return res.status(500).send({
                        status: "error",
                        message: "Producto no encontrado " + error
                    });
                }

                if (listProducto.length == 0) {
                    return res.status(200).send({
                        status: "vacio",
                        message: "Producto no encontrado"
                    });
                }

                listProducto.forEach((dataList, index, data) => {

                    var _idNegocio = listProducto[index]._id;

                    dataList["zapatos"].forEach((producto, index, data) => {

                        let dataProducto = {
                            nameTable: "zapatos",
                            _id: _idNegocio,
                            data: producto
                        };

                        listaProductoEncontrados.push(dataProducto);

                    });
                });

                return res.status(200).send({
                    status: "success",
                    message: listaProductoEncontrados
                });

            });
    }

};

module.exports = controller;