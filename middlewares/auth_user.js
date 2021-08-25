const jwt = require ('jsonwebtoken');
const config = require('../config/development.json');

let verificarToken = (req, res, next) => {
    
    let token = req.get('Authorization');
    console.log("REcibiendo token", token);
    jwt.verify(token, config.configToken.SEED, (err, decoded) => {
        
        if (err) {
            return res.status(401).send({
                "status": err
            });
        }

        /*return res.status(401).send({
            "token": decoded.usuario         
        });*/
        
        req.usuario_autentificado = decoded.negocio;
        next()
    });
}

module.exports = verificarToken;