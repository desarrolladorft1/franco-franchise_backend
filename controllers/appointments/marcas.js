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

const getMarcas =  async (req, res = response ) =>{
    try {

        marcas = req.body;

//console.log(datos.email);

        var mailOptions = {
            from: 'contacto@franquiciat.com.mx',
            to: 'contacto@franquiciat.com.mx',
            subject: 'FranquiciaT: '+marcas.nombre+' '+marcas.apellidos+'-'+marcas.marca,
            html: 
            +'Nombre: '+marcas.nombre+' '+marcas.apellidos+salto
            +'Email: '+marcas.email+salto
            +'Telefono: '+marcas.telefono+salto
            +'Direccion: '+marcas.direccion+salto
            +'Ciudad: '+marcas.ciudad+salto
            +'Estado: '+marcas.estado+salto
            +'CP: '+marcas.cp+salto
            +'Mercado / Área de Interés: '+marcas.areainteres+salto
            +'Efectivo para invertir: '+marcas.invertir+salto
            +'Me interesa la marca: '+marcas.marca+salto
            +'Comentarios: '+marcas.comentarios

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
    getMarcas
}