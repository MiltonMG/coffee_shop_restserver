const {Router} = require('express');
const {check} = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controllers');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

//aqui estaran todas los endpoints (rutas)
        
router.post( '/', validarArchivoSubir, cargarArchivos )

router.put( '/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
],actualizarImagenCloudinary )
// ],actualizarImagen )

router.get( '/:coleccion/:id', [
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
],mostrarImagen )


module.exports = router;
