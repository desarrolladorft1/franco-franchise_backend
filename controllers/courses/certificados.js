const { response } = require("express");
const pdf = require('html-pdf');
var moment = require('moment');
moment.locale('es');

const { 
    setPDF,
    getUrlPDFCompletionById,
    getUrlPDFApprovalById
 } = require("../../SQL/contracts/pdf");

const {
    certificateOfCompletion, 
    certificateOfApproval 
} = require("../../constant/courses/certificados");

const {
    logoBase64, 
    fondoBase64 
} = require("../../img/img");

var { dbConnecttion } = require("../../db/config");

const createCertificateOfCompletionPDF =  async (req, res = response ) =>{

    try {

        const data = req.body;
        const zeroPad = (num, places) => String(num).padStart(places, '0');
        const transactionNumber = zeroPad( data.idTransaccionDetalle, 7 );
        const pdfUrl = `C:/Diezlegal/Certificados/${ data.idCliente }/Certificado de Completacion - ${ data.nombre } - ${ transactionNumber }.pdf`;

        const options = {
            "format": "A4",
            "orientation": "portrait",
            "border": {
                "left": "20mm",
                "right": "20mm"
            },
            "footer": {
                "height": "20mm"
            },
            "header": {
                "height": "35mm"
            }
        }

        const html =    '<div id="pageHeader"><img src="data:image/jpeg;base64,' + 
                        logoBase64 + '" width="90px" height="90px" align="right"></div>' + 
                        '<body><style> p { text-align:justify; text-justify:inter-word; } body { font-family: Helvetica, sans-serif; font-size: 12pt; line-height: 1.5; background-image: url("data:image/png;base64,' + 
                        fondoBase64 +  
                        '"); background-repeat: no-repeat; background-position: center; } </style>' + 
                        certificateOfCompletion.replace('$1', data.nombreCliente).replace('$2', data.nombre).replace('$3', moment().format('LL')) + 
                        '</body>';

        pdf.create( html, options ).toFile( pdfUrl , 
        async function(e, r) {
            if (r){
                let connet = await dbConnecttion();
                connet.query( setPDF, [ data.idCliente, data.idProducto, data.idTransaccionDetalle, pdfUrl ],
                function (err, rows, fields) {
                    if (err) throw err
                    return res.status(200).json( {
                        ok:true,
                        data: rows
                    });
                });
                connet.end();
            } else {
                return  res.status(500).json({
                    ok:false,
                    msg:"Algo salio mal al crear el PDF"
                });
            }
        });

    } catch (error) {
        console.log(error);
        return  res.status(500).json({
            ok:false,
            msg:"Algo salio mal al insertar en la base de datos"
        });
    }

}

const getCertificateOfCompletionPDF = async( req, res = response ) => {

    try {

        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getUrlPDFCompletionById, [ id ],
        function (err, rows, fields) {
            if (err) throw err
            return res.download(rows[0].urlPDF)
        });

        connet.end();
        
    } catch (error) {
        console.log(error);
        return  res.status(500).json({
            ok:false,
            msg:"Algo salio mal"
        });
    }

}

const createCertificateOfApprovalPDF =  async (req, res = response ) =>{

    try {

        const data = req.body;
        const zeroPad = (num, places) => String(num).padStart(places, '0');
        const transactionNumber = zeroPad( data.idTransaccionDetalle, 7 );
        const pdfUrl = `C:/Diezlegal/Certificados/${ data.idCliente }/Certificado de Aprobacion - ${ data.nombre } - ${ transactionNumber }.pdf`;

        const options = {
            "format": "A4",
            "orientation": "portrait",
            "border": {
                "left": "20mm",
                "right": "20mm"
            },
            "footer": {
                "height": "20mm"
            },
            "header": {
                "height": "35mm"
            }
        }

        const html =    '<div id="pageHeader"><img src="data:image/jpeg;base64,' + 
                        logoBase64 + '" width="90px" height="90px" align="right"></div>' + 
                        '<body><style> p { text-align:justify; text-justify:inter-word; } body { font-family: Helvetica, sans-serif; font-size: 12pt; line-height: 1.5; background-image: url("data:image/png;base64,' + 
                        fondoBase64 +  
                        '"); background-repeat: no-repeat; background-position: center; } </style>' + 
                        certificateOfApproval.replace('$1', data.nombreCliente).replace('$2', data.nombre).replace('$3', moment().format('LL')) + 
                        '</body>';

        pdf.create( html, options ).toFile( pdfUrl , 
        async function(e, r) {
            if (r){
                let connet = await dbConnecttion();
                connet.query( setPDF, [ data.idCliente, data.idProducto, data.idTransaccionDetalle, pdfUrl ],
                function (err, rows, fields) {
                    if (err) throw err
                    return res.status(200).json( {
                        ok:true,
                        data: rows
                    });
                });
                connet.end();
            } else {
                return  res.status(500).json({
                    ok:false,
                    msg:"Algo salio mal al crear el PDF"
                });
            }
        });

    } catch (error) {
        console.log(error);
        return  res.status(500).json({
            ok:false,
            msg:"Algo salio mal al insertar en la base de datos"
        });
    }

}

const getCertificateOfApprovalPDF = async( req, res = response ) => {

    try {

        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getUrlPDFApprovalById, [ id ],
        function (err, rows, fields) {
            if (err) throw err
            return res.download(rows[0].urlPDF)
        });

        connet.end();
        
    } catch (error) {
        console.log(error);
        return  res.status(500).json({
            ok:false,
            msg:"Algo salio mal"
        });
    }

}

module.exports = {
    createCertificateOfCompletionPDF,
    getCertificateOfCompletionPDF,
    createCertificateOfApprovalPDF,
    getCertificateOfApprovalPDF
}