const { request, response } = require("express");
const { Producto } = require("../models");

// obtener categorias (PAGINADO - TOTAL DE CATEGORIAS - POPULATE: nos sirve para ver los datos del usuario relacionado)

const getProducto = async (req, res) => {//GET
    const { limite = 5, desde = 0 } = req.query; //Obtener las query del url

    //Realizando multiples promesas 
    const [ total, productos ] = await Promise.all([//LAS FILTRAMOS POR LAS QUE ESTEN CON STATUS TRUE
        Producto.countDocuments({ status: true }),//primer resultado en totales
        Producto.find({ status: true }) //segundo resultado en produtos
        //Con la segunda opcion en populate indicamos solo el campo que queremos de la coleccion
        .populate('usuario', 'name') //Seleccionar la tabla usuarios el nombres (vinculacion de entre schemas )
        .populate('categoria', 'name') //Seleccionar la tabla categorias el nombres (vinculacion de entre schemas )
        .skip(Number(desde))
        .limit(Number(limite)),
        
    
    ]);

    res.json({
        total,
        productos
    });
}

// Obtener categoria por id - populate {}
const getProductoPorId =  async (req, res) => {//GET

    const { id } = req.params

    try {

        //Con la segunda opcion en populate indicamos solo el campo que queremos de la coleccion
        const producto = await Producto.findById(id).populate('usuario', 'name').populate('categoria', 'name');

        if (!producto) {
            return res.status(400).json({
                msg:"La producto no existe"
            });
        }

        res.json({
            producto
        });

        
    } catch (error) {
        return res.status(400).json({
            msg:"El id ingresado no es valido",
            error
        });
    }
    
}


const crearProducto = async (req = request, res = response) => {//POST

    const nameProducto = req.body.name.toUpperCase();//nombre del producto
    
    const productoBD = await Producto.findOne({name: nameProducto})

    if (productoBD) {
        return res.status(400).json({
            msg: `El Producto ${nameProducto}, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        name: nameProducto,
    //Para que la informacion del usuario este en el request tenemos que validar el JWT (usando el middleware)
        usuario: req.usuario._id,
        precio: req.body.precio,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion
    }

    const producto = new Producto( data );

    try {
        await producto.save();

        res.status(201).json({
            producto
        })
        
    } catch (error) {
        res.json({
            msg:'Error al momento de intentar crear un producto: \n',error
        })
    }

}

//Actualizar producto
const actualizarProductoPut = async(req = request, res = response) => {

    const { id } = req.params;
    
    const {usuario, ...data} = req.body;

    data.name = data.name.toUpperCase();

    //Para que la informacion del usuario este en el request tenemos que validar el JWT (usando el middleware)
    data.usuario = req.usuario._id
    
    
    try {
        const producto = await Producto.findByIdAndUpdate( id, data, {new:true});

        res.json(producto);
        
    } catch (error) {
        res.json({
            msg:'Algo salio mal al momento de buscar y actualizar la producto',
            error
        })
        
    }

}

// Borrar producto (Cambiar el estado a FALSE)

const borrarProductoDelete = async(req = request, res = response) => {

    const { id } = req.params //ennviamos el id como parametro en la url
    

    //Borrando: CAMBIANDO ESTADO DE LA BASE DE DATOS
    try {
        const producto = await Producto.findByIdAndUpdate(id, {status: false}, {new: true});
        res.json({producto});
        
    } catch (error) {
        res.json({
            msg:'Error al momento de intentar eliminar una producto',
            error
        })
    }



}

module.exports = {
    getProducto,
    getProductoPorId,
    crearProducto,
    actualizarProductoPut,
    borrarProductoDelete
}