const jwt = require ('jsonwebtoken');
const config = require('../config/development.json');

let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    
    jwt.verify(token, config.configToken.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                "status": err
            });
        }
        //console.log(decoded);
        /*return res.status(200).send({
            status:"No autentificado",
            message: decoded.usuario         
        });*/
        
        req.negocio_autentificado = decoded.negocio;
        next()
    });
}

module.exports = verificarToken;