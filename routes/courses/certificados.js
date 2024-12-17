const { Router } = require('express');
const { 
    createCertificateOfCompletionPDF,
    getCertificateOfCompletionPDF,
    createCertificateOfApprovalPDF,
    getCertificateOfApprovalPDF
} = require('../../controllers/courses/certificados');

const router = Router();

router.post("/certificados/completacion/crear", createCertificateOfCompletionPDF );
router.post("/certificados/completacion/descargar", getCertificateOfCompletionPDF );
router.post("/certificados/aprobacion/crear", createCertificateOfApprovalPDF );
router.post("/certificados/aprobacion/descargar", getCertificateOfApprovalPDF );

module.exports = router;