const { request, response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [//en un caso real hay q sacar las colecciones de la base de datos
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async( termino = 'Sin datos', res = response ) => {

    const esMongoId = ObjectId.isValid( termino ); // validar si es un mongo id retorna true or false 

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp( termino, 'i' );//Haciendo insensible las busquedas (minusculas o mayusculas no importa)

    const usuarios = await Usuario.find({ 
        $or: [{name: regex}, {email: regex}],//Buscando en nombre o correo
        $and: [{ status: true }]
    });
    
    return res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = 'Sin datos', res = response ) => {

    const esMongoId = ObjectId.isValid( termino ); // validar si es un mongo id retorna true or false 

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp( termino, 'i' );//Haciendo insensible las busquedas (minusculas o mayusculas no importa)

    const categorias = await Categoria.find({ name: regex, status: true });
    
    return res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = 'Sin datos', res = response ) => {

    const esMongoId = ObjectId.isValid( termino ); // validar si es un mongo id retorna true or false 

    if (esMongoId) {
        //  BUSCAR POR ID DEL PRODUCTO
        const producto = await Producto.findById(termino).populate('categoria','nombre');

        if (producto) {
            return res.json({
                results: (producto) ? [producto] : []
            });
        }

        //BUSCAR POR ID DE LA CATEGORIA
        const productoPorCateoria = await Producto.find({categoria: ObjectId(termino)}).populate('categoria','name');

        return res.json({
            results: (productoPorCateoria) ? [productoPorCateoria] : []
        });

    }

    const regex = new RegExp( termino, 'i' );//Haciendo insensible las busquedas (minusculas o mayusculas no importa)

    const categoria = await Categoria.find({name: regex, status: true})
    
    //AL REALIZAR UN IF POR CATEGORIAS PRIMERO, CATEGORIAS SE PREORIZA AL REALIZAR LA BUSQUEDA

    if (categoria.length) {
        
        //BUSCAR POR NOMBRE DE CATEGORIA
        const productosPorCategoria = await Producto.find({
            $or: [...categoria.map( c => { return {categoria: c._id} } )]
        }).populate('categoria', 'name');  

        if (!productosPorCategoria.length) {//si no encuentro nada retorno este mensaje
            return res.json({
                msg: `There's no results with (${termino}) in search product by category`
            }); 
        }
        
        return res.json({
            results: productosPorCategoria
        });

    }else{
        //Busqueda producto por nombre
        const productos = await Producto.find({ name: regex, status: true }).populate('categoria', 'name');
        console.log(productos);
        
        if (!productos.length) {//si no encuentro nada retorno este mensaje
            return res.json({
                msg: `There's no results with (${termino}) in search product by name`
            }); 
        }

        return res.json({
            results: productos
        });

    }

}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'roles':
            break;

        default:
            res.status(500).json({
                msg: 'se le olvido hacer esta busqueda'
            });
    }

    

}


module.exports = {
    buscar
}