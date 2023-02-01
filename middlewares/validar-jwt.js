const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');//pedimos el token en el header 

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        
        //verificamos que el JWT sea el mismo y colocamos la private key tambien
        const payload = jwt.verify( token, process.env.SECRETORPRIVATEKEY );//esto nos retorna el payload del token
        //podemos hacer un log al payload para ver su contenido

        const usuario =  await Usuario.findById(payload.uid);//Buscamos al usuario por su id en la bd
        
        //Verificar que usuario exista
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existente'
            })
        }

        //verificar si el usuario que quiere borrar tiene estado en true 
        if (!usuario.status) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }
        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
    }


}

module.exports = {
    validarJWT,
}
