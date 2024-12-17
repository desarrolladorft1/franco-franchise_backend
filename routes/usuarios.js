const { Router } = require('express');
const { 
        setUsuario, 
        getUsuarioPorKey,
        editUserDetail ,
        getNonLawyerUsers
} = require('../controllers/usuarios');

const router = Router();

router.post("/usuarios/crear", setUsuario)
router.post("/usuarios", getUsuarioPorKey)
router.post("/usuarios/editUser", editUserDetail)

router.get("/usuarios/no-abogados", getNonLawyerUsers)

module.exports = router;