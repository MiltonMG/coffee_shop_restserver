const path = require('path');
const fs = require('fs');//FileSystem para gestionar archivos del sistema

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response, request } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");



const cargarArchivos = async (req = request, res = response) => { 

    try {
        const nombreFinalArchivo = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre: nombreFinalArchivo
        })
        
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const actualizarImagen = async(req = request, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({msg:'No existe un usuario con el id:', id})
            }
            break;
        
            case 'productos':
                modelo = await Producto.findById(id)
                if (!modelo) {
                    return res.status(400).json({msg:'No existe un producto con el id: '+id})
                }
                break;
    
        default:
            return res.status(500).json({msg:'Esta coleccion no esta programada aun jaja'});
    }

    //Eliminar imagenes previas, para evitar un basurero
    if (modelo.img) {
        //Recortamos el url de la imagen para solo obtener su nombre, (en el url esta el nombre)
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.')

        cloudinary.uploader.destroy( public_id );
    }

    const {tempFilePath} = req.files.archivo

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url;
    
    await modelo.save();

    res.json(modelo)
}

const actualizarImagenCloudinary = async(req = request, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({msg:'No existe un usuario con el id:', id})
            }
            break;
        
            case 'productos':
                modelo = await Producto.findById(id)
                if (!modelo) {
                    return res.status(400).json({msg:'No existe un producto con el id: '+id})
                }
                break;
    
        default:
            return res.status(500).json({msg:'Esta coleccion no esta programada aun jaja'});
    }

    //Eliminar imagenes previas, para evitar un basurero
    if (modelo.img) {
        //Hay que borrar la imagen del servidor (capturamos su path como primer paso)
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync( pathImagen )) {// verificando si el path existe en el filesystem
            fs.unlinkSync(pathImagen); //Eliminando la imagen enviando su path (en el path local)
        }
    }

    const nombreFinalArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombreFinalArchivo;
    
    await modelo.save();

    res.json(modelo)
}

const mostrarImagen = async (req = request, res = response) => {
    
    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({msg:'No existe un usuario con el id:', id})
            }
            break;
        
            case 'productos':
                modelo = await Producto.findById(id)
                if (!modelo) {
                    return res.status(400).json({msg:'No existe un producto con el id: '+id})
                }
                break;
    
        default:
            return res.status(500).json({msg:'Esta coleccion no esta programada aun jaja'});
    }

    //Eliminar imagenes previas, para evitar un basurero
    if (modelo.img) {
        return res.redirect(modelo.img);
    }

    //Respueta si no se encuentra imagen
    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}


module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
