const { Router } = require('express');

const {
    getFavoriteLawyersById,
    getLawyerIdByUserId,
} = require('../../controllers/profile/lawyers');

const router = Router();

router.post("/favorite-lawyers", getFavoriteLawyersById);
router.post("/getLawyerIdByUserId", getLawyerIdByUserId);

module.exports = router;