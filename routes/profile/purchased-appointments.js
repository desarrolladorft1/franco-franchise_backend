const { Router } = require('express');

const {
    getPurchasedAppointmentsByUser,
    getCompletedAppointmentsByUser,
    getCanceledAppointmentsByUser
} = require('../../controllers/profile/purchased-appointments');

const router = Router();

router.post("/purchased-appointments", getPurchasedAppointmentsByUser);
router.post("/completed-appointments", getCompletedAppointmentsByUser);
router.post("/canceled-appointments", getCanceledAppointmentsByUser);

module.exports = router;