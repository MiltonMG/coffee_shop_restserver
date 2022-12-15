
const {Router} = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios.controllers');

const router = Router();

//aqui estaran todas los endpoints (rutas)
        
router.get('/', usuariosGet);

router.put('/:id', usuariosPut);//el id indica que se espera un parametro de segmento (un valor)

router.post('/', usuariosPost);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;