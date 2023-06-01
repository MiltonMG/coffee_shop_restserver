
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    name: {
        type: String,
        required: [true,"El nombre de la categoria es obligatorio"],
        unique: true
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
    }
})

module.exports = model('Categoria', CategoriaSchema);

