
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true,"El rol es obligatorio"]
    },
    status: {
        type: Boolean,
        default: true,
        required: [true, "El status es obligatorio"],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    descripcion: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
})

module.exports = model('Producto', ProductoSchema);




