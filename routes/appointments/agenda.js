const { Router } = require('express');

const {
    getAppointmentsByLawyerId,
    getAppointmentsByDatesAndLawyerId,
    deleteAppointmentScheduledById,
    getMissingRangesDate,
    setSchedule,
} = require('../../controllers/appointments/agenda');

const router = Router();

router.post("/getAppointmentsByLawyerId", getAppointmentsByLawyerId);
router.post("/getAppointmentsByDatesAndLawyerId", getAppointmentsByDatesAndLawyerId);
router.post("/deleteAppointmentScheduledById", deleteAppointmentScheduledById);
router.post("/getMissingRangesDate", getMissingRangesDate);
router.post("/setSchedule", setSchedule);


module.exports = router;