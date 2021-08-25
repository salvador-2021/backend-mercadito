'use strict';
// prueba js editado
//Cargar modulos de node para crear servidor
//salvador editando...
const express = require('express');
const bodyParser = require('body-parser');

//Ejecutar express (http)
const app = express();

require('./tareas-programadas/fecha_pago');
//Cargar fichero rutas
const negocio_routes = require('./routes/negocio/negocio');
const registrar_negocio_routes = require('./routes/negocio/registrar_negocio');
const usuario_routes = require('./routes/usuario');
const auth_routes = require('./routes/auth');
const perfil_routes = require('./routes/perfil');
const verificarToken_routes = require('./routes/verificarToken');

const producto_routes = require('./routes/producto/producto');
const lineaProducto_routes = require('./routes/producto/linea_producto');

const servicio_routes = require('./routes/servicio/servicio');
const tipo_servicio_routes = require('./routes/servicio/tipo_servicio');

const zapatos_routes = require('./routes/zapato/zapatos');
const zapatos_marca_router = require('./routes/zapato/marca_zapato');
const zapatos_tipo_router = require('./routes/zapato/tipo_zapato');

const tipoRopa_router = require('./routes/ropa/tipo_ropa');
const marcaRopa_router = require('./routes/ropa/marca_ropa');
const ropas_router = require('./routes/ropa/ropa');

const computadora_router = require('./routes/computadora');
const fruteria_router = require('./routes/fruteria');
const carniceria_router = require('./routes/carniceria');
const mueble_router = require('./routes/mueble');
const cama_router = require('./routes/cama');
const bicicleta_router = require('./routes/bicicleta');
const tela_router = require('./routes/tela');
const celular_router = require('./routes/celular');
const cerrajeria_router = require('./routes/cerrajeria');
const accesorio_movil_router = require('./routes/accesorio_movil');
const moto_router = require('./routes/moto');
const plomeria_router = require('./routes/plomeria');
const farmacia_router = require('./routes/farmacia');
const papeleria_router = require('./routes/papeleria');
const joyeria_router = require('./routes/joyeria');
const construccion_router = require('./routes/construccion');
const relojeria_router = require('./routes/relojeria');
const optica_router = require('./routes/optica');
const ferreteria_router = require('./routes/ferreteria');
const fierro_router = require('./routes/fierro');
const fotos_router = require('./routes/fotos');
const hivernadero_router = require('./routes/hivernadero');
const carpinteria_router = require('./routes/carpinteria');
const dentista_router = require('./routes/dentista');
const bodega_router = require('./routes/bodega');
const pintura_router = require('./routes/pintura');
const herreria_router = require('./routes/herreria');
const veladora_router = require('./routes/veladora');
const floreria_router = require('./routes/floreria');
const funeraria_router = require('./routes/funeraria');
const alimento_router = require('./routes/alimento');

/*BUSQUEDAS */
const busqueda_producto = require('./routes/busqueda_principal_producto');

//------------>ELECTRODOMESTICOS<-----------
const television_router = require('./routes/electrodomesticos/television');
const microonda_router = require('./routes/electrodomesticos/microonda');
const licuadora_router = require('./routes/electrodomesticos/licuadora');
const refrigerador_router = require('./routes/electrodomesticos/refrigerador');
const plancha_router = require('./routes/electrodomesticos/plancha');
const comentario_router = require('./routes/comentario');

//==========MY COMPANY===============================
const mycompany = require('./routes/config-mycompany/company');
const admin_router = require('./routes/config-mycompany/admin');
const img_linea_negocio = require('./routes/config-mycompany/img-linea-negocio');
//===========PAGOS======================================
const pago_negocio_router = require('./routes/pagos/pago_negocio');

//Middlewares
//app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

//var jsonParser       = bodyParser.json({limit:1024*1024*20});
//var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoded' })

//app.use(jsonParser);
//app.use(urlencodedParser);

//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
	);
	res.header(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, DELETE'
	);
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

//Añadir prefijos a rutas / cargar rutas
app.use('/api/negocio', negocio_routes);
app.use('/api/registrar_negocio', registrar_negocio_routes);
app.use('/api/usuario', usuario_routes);
app.use('/api/auth', auth_routes);
app.use('/api/perfil', perfil_routes);
app.use('/api/verificar_token', verificarToken_routes);
app.use('/api/pagos', pago_negocio_router);

//RUTAS DE PRODUCTOS EN GENERAL
app.use('/api/producto', producto_routes);
app.use('/api/producto-linea', lineaProducto_routes);
//RUTAS PARA SERVICIOS
app.use('/api/servicio', servicio_routes);
app.use('/api/servicio-tipo', tipo_servicio_routes);
//RUTAS PARA ZAPATOS
app.use('/api/calzado', zapatos_routes);
app.use('/api/zapatos-marca', zapatos_marca_router);
app.use('/api/zapatos-tipo', zapatos_tipo_router);
//RUTAS PARA ROPA
app.use('/api/ropa-tipo', tipoRopa_router);
app.use('/api/ropa-marca', marcaRopa_router);
app.use('/api/ropa', ropas_router);

app.use('/api/computadora', computadora_router);
app.use('/api/fruteria', fruteria_router);
app.use('/api/carniceria', carniceria_router);
app.use('/api/muebleria', mueble_router);
app.use('/api/cama', cama_router);
app.use('/api/bicicleta', bicicleta_router);
app.use('/api/tela', tela_router);
app.use('/api/celular', celular_router);
app.use('/api/cerrajeria', cerrajeria_router);
app.use('/api/accesorio_movil', accesorio_movil_router);
app.use('/api/moto', moto_router);
app.use('/api/plomeria', plomeria_router);
app.use('/api/farmacia', farmacia_router);
app.use('/api/papeleria', papeleria_router);
app.use('/api/joyeria', joyeria_router);
app.use('/api/construccion', construccion_router);
app.use('/api/relojeria', relojeria_router);
app.use('/api/optica', optica_router);
app.use('/api/ferreteria', ferreteria_router);
app.use('/api/fierro', fierro_router);
app.use('/api/fotos', fotos_router);
app.use('/api/hivernadero', hivernadero_router);
app.use('/api/carpinteria', carpinteria_router);
app.use('/api/dentista', dentista_router);
app.use('/api/bodega', bodega_router);
app.use('/api/pintura', pintura_router);
app.use('/api/herreria', herreria_router);
app.use('/api/veladora', veladora_router);
app.use('/api/floreria', floreria_router);
app.use('/api/funeraria', funeraria_router);
app.use('/api/alimento', alimento_router);

//------------>ELECTRODOMESTICOS<-----------
app.use('/api/microonda', microonda_router);
app.use('/api/television', television_router);
app.use('/api/licuadora', licuadora_router);
app.use('/api/refrigerador', refrigerador_router);
app.use('/api/plancha', plancha_router);

app.use('/api/busqueda_principal_producto', busqueda_producto);

//RUTAS PARA COMENTARIO
app.use('/api/comentario_producto', comentario_router);

//----------------->MY COMPANY<--------------------
app.use('/api/mycompany', mycompany);
app.use('/api/admin', admin_router);
app.use('/api/img_linea_negocio', img_linea_negocio);

//Exportar modulos (fichero actual)

module.exports = app;
