const { response } = require("express")
var { dbConnecttion } = require("../../db/config");
var nodemailer = require('nodemailer');
const { setTransaction,
        setTransactionDetails,
        getAssignedLawyer,
        getLawyerToAssign,
        setTransactionDetails2,
        setTransaction2
    } = require("../../SQL/contracts/transacciones");

// const { } = require("../../SQL/courses/productos");

// const { } = require("./carrodecompra");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contacto@franquiciat.com.mx',
        pass: 'wszcktrdlozlkrjp'
    }
});

const { sendAppointmentsNotifications } = require("../../funtions/appointments");

const { getCoursesContentHeaderSQL,
    setUser_Viewed,
    setNewUsuarioExamen } = require("../../SQL/courses/productos");

const { borrarCarritoDespuesDeComprar } = require("./carrodecompra");

const setTransaccion =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const data = req.body;
        console.log(data);
        new Promise((resolve, reject) => {
            connet.query(getLawyerToAssign, function (err, rows, fields) {
                if (err) throw err
                resolve({ ok: true, data: rows })
            });
        }).then(value => {
            if (value) {
                console.log(value);
                connet.query(setTransaction, [value.data[0].idAbogados, data.idCliente, data.idCliente, data.neto],
                    function (err, rows, fields) {
                        if (err) throw err
                        return res.status(200).json({
                            ok: true,
                            data: rows
                        });
                    });
                connet.end();
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}


async function sendMail(data,connet) {
    const promiseToSendMail = function(resolve,reject) {
        const values = [];
        const formato = new Intl.NumberFormat('es-MX', { style: 'currency',  currency: 'MXN' });

        var asunto = "FRANQUICIAT - Transaccion #" + data[0].idTransaccion;
        var mensaje = '';

        var mensajeContratos = `
                                <p>Gracias por confiar en FRANQUICIAT, recuerda que podrás ver el curso en la sección cursos comprados <strong>$1</strong>, en el siguiente botón:</p>
                                <p><a href="https://franquiciat.com.mx/#/cursos-comprados">Ir a mis cursos</a></p>
                                
                                <p>Te deseamos un excelente día.</p>
                                <p>¡Tu equipo de FRANQUICIAT!</p>
                               `;

        mensaje = mensaje + `<div><img src="cid:franquiciat" width="90px" height="90px" display="flex"></div><div><p>Resumen de la compra:</p><ul>`

        data.forEach(element => {
            for (let i = 0; i < element.cantidad; i++) {
                values.push([element.idTransaccion, element.idProductos, element.neto]);
            }

            mensaje = mensaje + '<li>' + element.nombre_producto + ': MX' + ( formato.format(element.cantidad * element.neto) ) + '</li>'

            mensajeContratos = mensajeContratos.replace('$1',element.nombre_producto);

        });
    
        mensaje = mensaje + '</ul></div>';
    
        new Promise((resolve, reject) => {
            connet.query(getAssignedLawyer, [data[0].idTransaccion],
                function (err, rows, fields) {
                    if (err) throw err
                    resolve({ ok: true, data: rows })
                });
        }).then(value => {
            if (value) {
                mensaje = mensaje + `<div>
                                        <p><strong>Total de Productos comprados: ${data.length}</strong><p>
                                        <p><strong>Total de MX${formato.format(data[0].total)}</strong><p>
                                        <p><strong>El abogado asignado a tu compra es: ${value.data[0].abogado}</strong><p>
                                    </div>`;

                mensajeContratos = mensajeContratos.replace('$2', value.data[0].abogado).replace('$3', value.data[0].nombres);
                mensaje = mensaje + '<footer><img src="cid:email_footer" display="flex"></footer>';                    

                var mailOptions = {
                    from: 'contacto@franquiciat.com.mx',
                    to: data[0].email,
                    subject: asunto,
                    html: mensajeContratos/*,
                    attachments: [{
                        filename: 'diezlegal.jpeg',
                        path: __dirname + '/../../img/diezlegal.jpeg',
                        cid: 'diezlegal'
                    },
                    {
                        filename: 'email_footer.jpg',
                        path: __dirname + '/../../img/email_footer.jpg',
                        cid: 'email_footer'
                    }]*/
                }
    
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('error');
                    } else {
                        console.log('Email enviado: ' + info.response);
                    }
                });
    
                resolve(values) 
            }
        })
    }
    return new Promise(promiseToSendMail);
}

async function sendMail2(data,connet) {
    const promiseToSendMail = function(resolve,reject) {
        const values = [];
        const formato = new Intl.NumberFormat('es-MX', { style: 'currency',  currency: 'MXN' });

        var asunto = "FRANQUICIAT - Transaccion #" + data[0].idTransaccion;
        var mensaje = '';

        var mensajeContratos = `
        <p>Gracias por confiar en FRANQUICIAT, recuerda que podrás ver tu servicio comprado <strong>$1</strong>, en el siguiente botón:</p>
        <p><a href="https://franquiciat.com.mx/#/servicios-comprados">Ir a mis servicios</a></p>
        <p><strong>$2</strong> es tu asesor personal, quien te ayudará con 
        información, dudas o quejas en el servicio contratado. En breve, <strong>$3</strong> se 
        pondrá en contacto contigo vía telefónica.</p>
        <p>Te deseamos un excelente día.</p>
        <p>¡Tu equipo de FRANQUICIAT!</p>
                               `;

        mensaje = mensaje + `<div><img src="cid:franquiciat" width="90px" height="90px" display="flex"></div><div><p>Resumen de la compra:</p><ul>`

        data.forEach(element => {
            for (let i = 0; i < element.cantidad; i++) {
                values.push([element.idTransaccion, element.idProductos, element.neto]);
            }

            mensaje = mensaje + '<li>' + element.nombre_producto + ': MX' + ( formato.format(element.cantidad * element.neto) ) + '</li>'

            mensajeContratos = mensajeContratos.replace('$1',element.nombre_producto);

        });
    
        mensaje = mensaje + '</ul></div>';
    
        new Promise((resolve, reject) => {
            connet.query(getAssignedLawyer, [data[0].idTransaccion],
                function (err, rows, fields) {
                    if (err) throw err
                    resolve({ ok: true, data: rows })
                });
        }).then(value => {
            if (value) {
                mensaje = mensaje + `<div>
                                        <p><strong>Total de Productos comprados: ${data.length}</strong><p>
                                        <p><strong>Total de MX${formato.format(data[0].total)}</strong><p>
                                        <p><strong>El abogado asignado a tu compra es: ${value.data[0].abogado}</strong><p>
                                    </div>`;

                mensajeContratos = mensajeContratos.replace('$2', value.data[0].abogado).replace('$3', value.data[0].nombres);
                mensaje = mensaje + '<footer><img src="cid:email_footer" display="flex"></footer>';                    

                var mailOptions = {
                    from: 'contacto@franquiciat.com.mx',
                    to: data[0].email,
                    subject: asunto,
                    html: mensajeContratos/*,
                    attachments: [{
                        filename: 'diezlegal.jpeg',
                        path: __dirname + '/../../img/diezlegal.jpeg',
                        cid: 'diezlegal'
                    },
                    {
                        filename: 'email_footer.jpg',
                        path: __dirname + '/../../img/email_footer.jpg',
                        cid: 'email_footer'
                    }]*/
                }
    
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('error');
                    } else {
                        console.log('Email enviado: ' + info.response);
                    }
                });
    
                resolve(values) 
            }
        })
    }
    return new Promise(promiseToSendMail);
}

async function rel_dim_productos_content_detaill_usuario(data,connet) {
    //console.log(data);
    try {
        if (data.length > 0) {
            data.forEach(element => {
                //console.log(element);
                if ( element.tipo == "Cursos") {
                    console.log(element.examenId);
                    if(element.examenId != null && element.examenId != undefined) {
                    
                        connet.query(setNewUsuarioExamen, [element.examenId, element.idCliente])
                    };
                    
                    connet.query(getCoursesContentHeaderSQL, element.idProductos,
                    function (err, rows, fields) {
                        if (err) throw err
                        if (rows.length > 0) {
                            console.log(rows);
                            rows.forEach(elementConten => { 
                                connet.query(setUser_Viewed, [elementConten.id_detail, element.idCliente])
                            });
                        }
                    })
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const setTransaccionDetallesCursos = async (req, res = response) => {

    try {

        let connet = await dbConnecttion();
        const data = req.body;
        rel_dim_productos_content_detaill_usuario(data,connet);
        new Promise((resolve, reject) => {
            sendMail(data,connet).then(value => {
                if (value) {
                    connet.query(setTransactionDetails2, [value],
                        function (err, rows, fields) {
                            if (err) throw err
                            resolve({ ok: true, data: rows })
                        });
                }
            })
        }).then(respuesta => {
            connet.end();
            return res.status(200).json({ ok: true, data: respuesta });
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}


const setTransaccionDetalles = async (req, res = response) => {

    try {

        let connet = await dbConnecttion();
        const data = req.body;
        console.log(data);
        
        new Promise( async (resolve, reject) => {
            sendMail2(data,connet).then(value => {
                 if (value) {
                 resolve(true)

                 for(let element of data){
                    connet.query(setTransactionDetails, [   element.idTransaccion, 
                        element.idProductoOriginal,
                        element.idProductos, 
                        element.neto]);
                }

                resolve({ ok: true, data: data })

              
                }
            })
        }).then(respuesta => {
            // borrarCarritoDespuesDeComprar(data[0].idTransaccion, connet);
            connet.end();
            return res.status(200).json({ ok: true, data: respuesta });
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}


const setTransaccionDetallesCitas = async (req, res = response) => {

    try {

        let connet = await dbConnecttion();
        const data = req.body[0];

        connet.query(setTransactionDetails, [ data.idTransaccion, data.idProductoOriginal, data.idProductos, data.neto ],
            function (err, rows, fields) {
                if (err) throw err
                sendAppointmentsNotifications(data.idProductos, connet, 1);
                return res.status(200).json({ ok: true, data: rows });
            })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const setTransaccionDetalles2 = async (req, res = response) => {

    try {

        let connet = await dbConnecttion();
        const data = req.body;
        rel_dim_productos_content_detaill_usuario(data,connet);
        new Promise((resolve, reject) => {
            sendMail2(data,connet).then(value => {
                if (value) {
                    connet.query(setTransactionDetails2, [value],
                        function (err, rows, fields) {
                            if (err) throw err
                            resolve({ ok: true, data: rows })
                        });
                }
            })
        }).then(respuesta => {
            borrarCarritoDespuesDeComprar(data[0].idTransaccion, connet);
            connet.end();
            return res.status(200).json({ ok: true, data: respuesta });
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}





module.exports = {
    setTransaccionDetalles,
    setTransaccionDetallesCitas,
    setTransaccionDetallesCursos,
    setTransaccion,
    setTransaccionDetalles2
}
