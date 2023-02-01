//nos sirve para realizar una importacion mas limpia en usuarios.routes.js

const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validaCampos, 
    ...validarJWT, 
    ...validaRoles, 
}



