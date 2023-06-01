const { response, request } = require("express");
const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req = request, res = response) => {

    const {id_token} = req.body;
    

    try {
        
        const { name, img, email } = await googleVerify(id_token);

        //Generar referencia para ver si correo existe en la base de datos
        let usuario = await Usuario.findOne({email});

        //Si el usuario no existe lo crearemos
        if (!usuario) {
            
            const data = {
                name,
                email,
                img,
                password: ':P', //el password no importa por q nos estamos autenticando con correo de google
                role: "USER_ROLE",
                google: true
            }

            usuario = new Usuario( data );

            await usuario.save();

        }

        //Si el usuario en BD tiene el estado en false, negare su acceso en la aplicacion
        if (!usuario.status) {
            return res.status(401).json({
                msg: "El status es falso"
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

        
    } catch (error) {

        res.status(400).json({
            error: error,
            msg: "El token de google no se pudo verificar"
        })
    }

}


module.exports = {
    login,
    googleSignIn
}
