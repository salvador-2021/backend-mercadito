'use strict'
const Usuario = require('../../models/usuario');
const Validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/development.json');

var controller = {

    autentication :( req ,res )=>{
        
        var email=req.body.correo;
        var password=req.body.password;

        Usuario.findOne({correo: email})
        .then(datos =>{
            
            if(datos){
                console.log("usuario, ",datos);
                const passwordValido=bcrypt.compareSync( password , datos.password );
                
                if(!passwordValido) {

                    res.status(404).json({
                        status:'error',
                        msj:'Usuario o contraseña incorrecta.'
                    });
                    
                }

                if(passwordValido){

                    const jwToken = jwt.sign({
                                            negocio: { _id : datos._id , nombre:datos.nombre , correo:datos.correo , tipo: datos.tipo, password:datos.password }
                                         },
                                            config.configToken.SEED ,
                                            { expiresIn: config.configToken.expiration });
                    
                    res.status(200).json({
                        status:'success',
                        negocio:{
                            _id:datos._id ,
                            nombre:datos.nombre ,
                            correo:datos.correo,
                            tipo:datos.tipo
                        },
                        token:jwToken
                    });
                }
               
            }else{
                res.status(404).json({
                    status:'error',
                    msj:'Usuario o contraseña incorrecta.'
                })
            }

        })
        .catch(err =>{
            res.status(500).json({
                status:'error',
                msj:err

            });

        });

    }
};

module.exports = controller;