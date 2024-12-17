const { response } = require("express")
var nodemailer = require('nodemailer');
const fs = require('fs');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contacto@franquiciat.com.mx',
        pass: 'wszcktrdlozlkrjp'
    }
});

const redaccion = `
<br>
<hr>
`

const salto = `
<br>
`


const getFinanciamiento =  async (req, res = response ) =>{
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    try {

      
        datos = req.body;

//console.log(datos.email);



     


        var mailOptions = {
            from: 'contacto@franquiciat.com.mx',
            to: 'contacto@franquiciat.com.mx',
            subject: 'Financiamiento',
           
            html: 'Datos: ' 
                        +salto+'- Nombre: '+datos.nombres+' '+datos.apellidosP+' '+datos.apellidosM
                        +salto+'- Correo: '+datos.correo
                        +salto+'- Domicilio: '+datos.domicilio
                        +salto+'- Telefono: '+datos.Telefono
                        +redaccion+
                   'Información de Negocio: '
                         +salto+'- Nombre del Negocio: '+datos.nombreNegocio    
                         +salto+'- Tiempo existiendo del Negocio: '+datos.tiempoNegocio
                         +salto+'- Utilidades Mensuales del Negocio '+datos.utilidadesNegocio
                         +redaccion+
                   'Plan elegido: '
                         +salto+'- Tipo de plan: '+datos.tipoPlan
                         +salto+'- Archivo: '+datos.archivoPDF,

                         
                        
                        

        }

        // Envio de menjase por email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
console.log(error);

                return res.status(500).json( {
                    ok:false,
                    msg:"Algo salio mal"
                });


            } else {
                return res.status(200).json({
                    ok: true
                });
            }
        });

       
    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }
}

module.exports = {
    getFinanciamiento
}