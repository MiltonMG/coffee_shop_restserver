const { request, response } = require("express");
const { Categoria } = require("../models");

// obtener categorias (PAGINADO - TOTAL DE CATEGORIAS - POPULATE: nos sirve para ver los datos del usuario relacionado)

const getCategoria = async (req, res) => {//GET
    const { limite = 5, desde = 0 } = req.query; //Obtener las query del url

    //Realizando multiples promesas 
    const [ total, categorias ] = await Promise.all([//LAS FILTRAMOS POR LAS QUE ESTEN CON STATUS TRUE
        Categoria.countDocuments({ status: true }),
        Categoria.find({ status: true })
        .populate('usuario', 'name')
        .skip(Number(desde))
        .limit(Number(limite)),
        
    
    ]);

    res.json({
        total,
        categorias
    });
}

// Obtener categoria por id - populate {}
const getCategoriaPorId =  async (req, res) => {//GET

    const { id } = req.params

    try {

        const categoria = await Categoria.findById(id).populate('usuario');

        if (!categoria) {
            return res.status(400).json({
                msg:"La categoria no existe"
            });
        }

        res.json({
            categoria
        });

        
    } catch (error) {
        return res.status(400).json({
            msg:"El id ingresado no es valido",
            error
        });
    }
    
}


const crearCategoria = async (req = request, res = response) => {//POST

    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({name: name})

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${name}, ya existe`
        })
    }
    //Generar la data a guardar
    const data = {
        name,//Para que la informacion del usuario este en el request tenemos que validar el JWT (usando el middleware)
        usuario: req.usuario._id
    }
    
    const categoria = new Categoria( data );

    try {
        await categoria.save();

        res.status(201).json(categoria);
        
    } catch (error) {
        console.log('\n',error);
        res.json({
            msg:'Error al momento de intentar crear categoria: \n',error
        })
    }

}

//Actualizar categoria
const actualizarCategoriaPut = async(req = request, res = response) => {

    const { id } = req.params;
    
    const {estado, usuario, ...data} = req.body;

    data.name = data.name.toUpperCase();

    //Para que la informacion del usuario este en el request tenemos que validar el JWT (usando el middleware)
    data.usuario = req.usuario._id



    try {
        const categoria = await Categoria.findByIdAndUpdate( id, data, {new:true});

        res.json(categoria);
        
    } catch (error) {
        res.json({
            msg:'Algo salio mal al momento de buscar y actualizar la categoria',
            error
        })
        
    }
    // console.log(usuario);

    

}

// Borrar categoria (Cambiar el estado a FALSE)

const borrarCategoriaDelete = async(req = request, res = response) => {

    const { id } = req.params //ennviamos el id como parametro en la url
    

    //Borrando: CAMBIANDO ESTADO DE LA BASE DE DATOS
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, {status: false});
        res.json({categoria});
        
    } catch (error) {
        res.json({
            msg:'Error al momento de intentar eliminar una categoria',
            error
        })
    }



}

module.exports = {
    crearCategoria,
    getCategoria,
    getCategoriaPorId,
    borrarCategoriaDelete,
    actualizarCategoriaPut
}