//visualizacion del objeto en la bd
/*
{
    name: 'lukas',
    email: 'lukas@gmail.com',
    password: '1234123',
    img:'1283747url',
    role:'conductor',
    estado: 'false',
    google: true,
}
*/

const {Schema, model} = require('mongoose');

const usuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contrasenia es obligatorio'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        emun: ['ADMIN_ROLE', 'USER_ROLES']
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});


//sobrescribimos el metodos toJSON para quitar ciertos datos que no queremos enviar al 
//realizar peticion al endpoint, esto se envia donde se llama res.json(), esto esta en los controladores de las rutas
usuarioSchema.methods.toJSON = function() {

    //desestructuramos lo que viene en toObject() [Aca viene la data del endpoint]
    const { __v, password, _id, ...usuario } = this.toObject();

    usuario.uid = _id //en Mongo el id se muestra como _id, nosotros lo agregamos como uid
    return usuario;
}

//mongo DB se encargara de crear la coleccion segun el nombre
// que coloquemos en el primer argumento de metodo model
// se agrega en singular por que mongo se encarga de agregarle una S
//ejemplo, usuario -> usuarios 
//entonces nosotros le indicamos q queremos llamar al modelo como Usuario y no como Usuarios
module.exports = model( 'Usuario', usuarioSchema );


