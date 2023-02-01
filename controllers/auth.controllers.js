const { response } = require("express");
const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        //Verificar si el email existe
        const usuario = await Usuario.findOne({email});

        if (!usuario) {
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - correo"
            });
        }

        //Verificar si el usuario esta activo en el sistema
        if (usuario.status === false ) {
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - estado: false"
            });
        }

        //verificar la contraseña

        //con el siguiente metodo comparamos las dos passwords para ver si son las mismas
        const validPassword = bcryptjs.compareSync( password, usuario.password ); //esto retorna un booleano,
        if ( !validPassword ) {
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - password"
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Algo salio mal"
        })
    }

    

}


module.exports = {
    login
}
