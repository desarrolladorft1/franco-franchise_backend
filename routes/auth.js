const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario,
        loginUsuario,
        getAllRoleUsuario,
        getRoleUser } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// router.post("/new",[
//     check("name","El nombre no puedo estar vacio").not().isEmpty(),
//     check("email","El email es obligatorio").isEmail(),
//     check("password","El password es obligatorio"),
//     validarCampos
// ], crearUsuario );


// router.post("/",[
//     check("email","El email es obligatorio").isEmail(),
//     check("password","El password es obligatorio"),
//     validarCampos
// ], loginUsuario);

router.get("/AllRole", getAllRoleUsuario);
router.post("/UserRole", getRoleUser);


module.exports = router;