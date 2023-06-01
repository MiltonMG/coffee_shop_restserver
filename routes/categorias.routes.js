const {Router} = require('express');
const {check} = require('express-validator');
const { crearCategoria, getCategoria, getCategoriaPorId, actualizarCategoriaPut, borrarCategoriaDelete } = require('../controllers/categorias.controllers');
const { existeCategoria } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

//aqui estaran todas los endpoints (rutas)
        
/**
 * {{url}}/api/categorias
 */

//OBTENER TODAS LAS CATEGORIAS - PUBLICO
router.get('/', getCategoria);

//OBTENER UNA CATEGORIA EN PARTICULAR POR ID - PUBLICO 
router.get('/:id', [
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos    
],getCategoriaPorId);

//CREAR CATEGORIA - PRIVADO - CUALQUIER PERSONA CON TOKEN VALIDO //TODO:(de aca para abajo)
router.post('/',[ 
    validarJWT,
    check('name','El nombre es obligatorio').not().isEmpty(), 
    validarCampos
    ],crearCategoria);

//PUT PARA ACTUALIZAR REGISTRO POR ID - PRIVADO - CUALQUIER CON TOKEN VALIDO //TODO:(de aca para abajo)
router.put ('/:id',[
    validarJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoria ),
    validarCampos
], actualizarCategoriaPut);


//BORRAR UNA CATEGORIA - SOLAMENTE ADMINS - (SU ESTADO PASA DE ACTIVO A DESACTIVADO) //TODO:(de aca para abajo)
router.delete ('/:id', [
    validarJWT,
    esAdminRole,
    check('id').custom( existeCategoria ),
    check('id','No es un id de mongo valido').isMongoId(),
    validarCampos
]
,borrarCategoriaDelete);



module.exports = router;
