const { response } = require("express")
var nodemailer = require('nodemailer');


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

const getContacto =  async (req, res = response ) =>{
    try {

        datos = req.body;

//console.log(datos.email);

        var mailOptions = {
            from: 'contacto@franquiciat.com.mx',
            to: 'contacto@franquiciat.com.mx',
            subject: 'Contacto: '+datos.nombre+'-'+datos.empresa,
            html: datos.mensaje+ redaccion
            + 'Correo: '+datos.email+salto
            +'Nombre: '+datos.nombre+' '+datos.apellidos+salto
            +'Empresa: '+datos.empresa
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
    getContacto
}