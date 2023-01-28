const Role = require('../models/rol');
const Usuario = require('../models/usuario');

//ACA SE COLOCAN LOS VALIDADORES CUSTOM DE LOS MIDDLEWARE
//QUE LOS TENEMOS EN LAS RUTAS 

const esRoleValido = async (rol = "") => {
    const existRole = await Role.findOne({ rol });

    if ( !existRole ) {
        throw new Error('El rol no esta regisrado en la base de datos');
    }
} 

const emailExiste = async (email = '') => {

    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({ email: email })

    if ( existeEmail ) {
        throw new Error(`El correo ${ email }, ya esta registrado`);
    }

}

const existeUsuarioPorId = async ( id ) => {

    //verificar si el usuario existe
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El id no existe:${ id }`);
    }

}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
}
