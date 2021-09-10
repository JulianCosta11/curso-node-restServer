const { Router } = require('express');
const { check } = require('express-validator');
const Role = require('../models/role');
const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 caracteres.').isLength({ min: 6 }),
    check('correo', 'El correo no es válido.').isEmail(),
    //check('rol', 'No es un rol permitido.').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( async(rol = '') => {
        const existeRol = await Role.findOne({ rol });
        if ( !existeRol ) {
            throw new Error(`El rol ${ rol } no existe en base de datos`);
        }
    }),
    validarCampos
], usuariosPost);

router.put('/:id', usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/', usuariosDelete);


module.exports = router;