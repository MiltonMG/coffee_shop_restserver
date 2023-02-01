
const {Router} = require('express');
const {check} = require('express-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios.controllers');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {
    validarCampos, validarJWT, tieneRole, esAdminRole
} = require('../middlewares')

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

//aqui estaran todas los endpoints (rutas)
        
router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom( (id) => existeUsuarioPorId(id) ),
    check('role').custom( (rol) => esRoleValido(rol) ),
    validarCampos
] ,usuariosPut);//el id indica que se espera un parametro de segmento (un valor)

//en el segundo argumento se envian middlewares
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio, ademas debe tener mas de 6 letras').isLength({min: 6}),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( (correo) => emailExiste(correo) ),

    // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( (rol) => esRoleValido(rol) ),
    validarCampos,
] , usuariosPost);

router.delete('/:id',[
    validarJWT,
    //esAdminRole, //Fueza al usuario a q sea administrador
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom( (id) => existeUsuarioPorId(id) ),
    validarCampos
] ,usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;