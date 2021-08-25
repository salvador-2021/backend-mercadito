const jwt = require ('jsonwebtoken');
const config = require('../config/development.json');

var controller = {

    verificarToken: (req, res) => {
        
        let token = req.get('Authorization');

        jwt.TokenExpiredError
        
        jwt.verify(token, config.configToken.SEED, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    "status": "error",
                    message:err
                });
            }
            return res.status(200).send({
                status:"success",
                message: decoded.negocio         
            });
            
        });

    }
};

module.exports = controller;