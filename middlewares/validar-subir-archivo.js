const { response, request } = require("express")


const validarArchivoSubir = ( req = request, res = response, next ) => {

    //Validamos si se nos envio un archivo, sino mensaje de error
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        res.status(400).send({msg:'No se ha subido ningun archivo - validarArchivoSubir'});
        return;
    } 

    next();

}

module.exports = {
    validarArchivoSubir
}