'use strict'

var mongoose = require('mongoose');
var app=require('./app')
const config = require('./config/development.json');
//puerto
var port=3900;

mongoose.set('useFindAndModify',false);
mongoose.Promise = global.Promise;

mongoose.connect(config.configDB.HOST,{ useNewUrlParser: true , useUnifiedTopology :true })
        .then(()=>{
             console.log('La conexion se ha realizado correctamente');

             //Crear Servidor y ponerme a escuchar peticiones HTTP
             app.listen(port, () =>{
                  console.log('Servidor corriendo en http://localhost:'+port);
             });
        });

