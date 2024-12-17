const { Router } = require('express');

const {
    setPurchasedAppointmentInSuspendedState,
    setPurchasedAppointmentInCanceledState,
    saveNewAppointmentReview,
    changeAppointmentDate,
    setNewAppointment,
    setAppointmentContactInformation,
    changeAppointmentDateStatus,
    getDatesLawyer,
    getDatesInavailable
} = require('../../controllers/appointments/appointments');

const router = Router();

router.post("/suspended", setPurchasedAppointmentInSuspendedState);
router.post("/canceled", setPurchasedAppointmentInCanceledState);

router.post("/review", saveNewAppointmentReview);
router.post("/changeAppointmentDate", changeAppointmentDate);
router.post("/newAppointment", setNewAppointment );
router.post("/contactInformation", setAppointmentContactInformation );
router.post("/changeAppointmentDateStatus", changeAppointmentDateStatus );
router.post("/getDatesLawyer", getDatesLawyer);
router.post("/getDatesInavailable", getDatesInavailable);

module.exports = router;