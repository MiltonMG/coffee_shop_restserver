const { response, request} = require('express')
const bcryptjs = require('bcryptjs')

//importacion del modelo
const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');

const usuariosGet = async (req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query; //Obtener las query del url

    //Realizando multiples promesas 
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments({ status: true }),
        Usuario.find({ status: true })
        .skip(Number(desde))
        .limit(Number(limite))
    
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req , res) => {//Creacion de usuario
    
    //capturamos los datos enviados por el usuario
    const {name, email, password, role} = req.body;

    //creamos instancia del modelo de usuario, 
    // desde este punto mongo crea la coleccion en la bd
    const usuario = new Usuario( {
        name,
        email,
        password,
        role
    } )


    
    //encriptar contrasenia
    // estos son las veces q la encriptacion se hara
    //entre el numero sea mas grande mas dificil sera de desencriptar
    //por defecto los saltos son 10, pero si queremos mas o menos
    // se tienen q enviar como parametro en bcryptjs.genSaltSync()
    const salt = bcryptjs.genSaltSync();

    //guardamos en eel usuario la contraseña encriptada
    usuario.password = bcryptjs.hashSync(password, salt);
    
    //grabamos el registro en la base de datos
    await usuario.save();

    res.json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPut = async (req, res) => {//Actualizacion de usuario

    const { id } = req.params;

    //Separamos la informacion necesaria del body
    //La informacion que esta en resto es la que en realidad necesitamos modificar
    //la que esta aparte la sacamos para que no se realicen modificaciones en esas,
    // por que podria ser informacion q no queremos q se modifique
    const { _id, password, google, email, ...resto } = req.body;

    // TODO: Validar contra base de datos
    if (password) {//si el password existe, significa que el quiere actualizar contraseña

         //encriptar contrasenia
        // estos son las veces q la encriptacion se hara
        //entre el numero sea mas grande mas dificil sera de desencriptar
        //por defecto los saltos son 10, pero si queremos mas o menos
        // se tienen q enviar como parametro en bcryptjs.genSaltSync()
        const salt = bcryptjs.genSaltSync();

        //guardamos en eel usuario la contraseña encriptada
        resto.password = bcryptjs.hashSync(password, salt);

    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new:true});
    // console.log(usuario);

    res.json(usuario);
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async (req, res) => {

    const { id } = req.params
    
    //Borrando: FISICAMENTE - ELIMINANDO TODO SU CONTENIDO DE LA BASE DE DATOS
    /* 
    !const usuario = await Usuario.findByIdAndDelete( id );
    */

    //Borrando: CAMBIANDO ESTADO DE LA BASE DE DATOS
    const usuario = await Usuario.findByIdAndUpdate(id, {status: false});

    

    res.json(usuario);
}


module.exports = {
    usuariosGet,
    usuariosDelete,
    usuariosPatch,
    usuariosPost,
    usuariosPut
    
}
