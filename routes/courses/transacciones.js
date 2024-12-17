const { Router } = require('express');
const { getTransactionesDetallesPorClienteCourses,
        guathCheckCourses,
        getTransactionsDetailsByClientCoursesSpecifyOne
       } = require('../../controllers/courses/transacciones');

const router = Router();

router.post("/buyPay", getTransactionesDetallesPorClienteCourses)
router.post("/guathCheckCourses", guathCheckCourses)
router.post("/MyViewCourseRefresh", getTransactionsDetailsByClientCoursesSpecifyOne)


module.exports = router;