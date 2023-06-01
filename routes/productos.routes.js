const {Router} = require('express');
const {check} = require('express-validator');
const { getProducto, getProductoPorId, crearProducto, actualizarProductoPut, borrarProductoDelete } = require('../controllers/productos.controllers.js');
const { existeProducto } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

//aqui estaran todas los endpoints (rutas)
        
/**
 * {{url}}/api/categorias
 */

//OBTENER TODAS LAS CATEGORIAS - PUBLICO

router.get('/', getProducto);


//OBTENER UNA PRODUCTO EN PARTICULAR POR ID - PUBLICO 
router.get('/:id', [
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos    
],getProductoPorId);

//CREAR PRODUCTO - PRIVADO - CUALQUIER PERSONA CON TOKEN VALIDO 
router.post('/',[ 
    validarJWT,
    check('name','El nombre es obligatorio').not().isEmpty(), 
    validarCampos
    ],crearProducto);

//PUT PARA ACTUALIZAR REGISTRO POR ID - PRIVADO - CUALQUIER CON TOKEN VALIDO 
router.put ('/:id',[
    validarJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeProducto ),
    validarCampos
], actualizarProductoPut);

//BORRAR UNA PRODUCTO - SOLAMENTE ADMINS - (SU ESTADO PASA DE ACTIVO A DESACTIVADO) //TODO:(de aca para abajo)
router.delete ('/:id', [
    validarJWT,
    esAdminRole,
    check('id').custom( existeProducto ),
    check('id','No es un id de mongo valido').isMongoId(),
    validarCampos
]
,borrarProductoDelete);




module.exports = router;