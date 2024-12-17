const { Router } = require('express');

const {
    setLawyer,
    getEspecialidades,
    getLawyerSpecialties,
    getLawyersByFilter,
    createFavoriteLawyer,
    deleteFavoriteLawyer,
    getLawyerScheduleById,
    getLawyerById,
} = require('../../controllers/appointments/lawyers');

const router = Router();

router.post("/getEspecialidades", getEspecialidades);
router.post("/create", setLawyer);
router.post("/specialties", getLawyerSpecialties);
router.post("/getLawyerById", getLawyerById);
router.post("/getLawyersByFilter", getLawyersByFilter );
router.post("/favorite/create", createFavoriteLawyer );
router.post("/favorite/delete", deleteFavoriteLawyer );
router.post("/lawyerScheduleById", getLawyerScheduleById );


module.exports = router;
