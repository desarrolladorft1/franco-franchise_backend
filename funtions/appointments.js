var nodemailer = require('nodemailer');
var moment = require('moment');

const {
    payAnAppointment,
    rescheduleAnAppointment,
    stopAnAppointment,
    cancelAppointment,
    whatsappMsj
} = require("../constant/appointments/appointments");

const {
    getAppointmentDetailsSQL,
    updateAppointmentEventSQL
} = require("../SQL/appointments/appointments");

const { Client } = require('whatsapp-web.js');
const { google } = require('googleapis'); //Revisar API google calendar
const { OAuth2 } = google.auth; 
//

const qrcode = require('qrcode-terminal');

// Inicializar whatsapp-web - comentado para desarrollo
// const client = new Client();
// client.on('qr', qr => { qrcode.generate(qr, { small: true }); });
// client.on('ready', () => { console.log('Client is ready!'); });
// client.initialize();

// Inicializar google calendar
const oAuth2Client = new OAuth2(process.env.CALENDAR_ID, process.env.CLIENT_SECRET);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const scopes = [
    'https://www.googleapis.com/auth/calendar'
];
const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

// Inicializar envio de email
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contacto@franquiciat.com.mx',
        pass: 'wszcktrdlozlkrjp'
    }
});

async function sendAppointmentsNotifications(idCita, connet, tipo) {

    console.log('--ENTRO--');
    console.log(idCita);

    oAuth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
            console.log("TOKEN NUEVO: " + tokens.refresh_token);
            oAuth2Client.setCredentials({ refresh_token: tokens.refresh_token });
        } else {
            oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        }
    });
    console.log(oAuth2Client.credentials);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    try {

        moment.locale('es');
        var mensaje = '';
        var asunto = '';

        //Email al comprar una Cita
        if (tipo === 1) {
            mensaje = payAnAppointment;
            //Email al reagendar una Cita
        } else if (tipo === 2) {
            mensaje = rescheduleAnAppointment;
            //Email al suspender una Cita
        } else if (tipo === 3) {
            mensaje = stopAnAppointment;
            //Email al cancelar una Cita    
        } else if (tipo === 4) {
            mensaje = cancelAppointment;
        } else {
            mensaje = '';
        }

        new Promise((resolve, reject) => {
            connet.query(getAppointmentDetailsSQL, [idCita], function (err, rows, fields) {
                if (err) throw err

                console.log('--ENCONTRO LA CITA--');
                console.log(rows);

                // Crear evento para google calendar
                var fecha = moment(moment(rows[0].fechaCita).format('YYYY-MM-DD') + ' ' + rows[0].horaCita, 'YYYY-MM-DD HH:mm');
                const eventStartTime = new Date(fecha);
                const eventEndTime = new Date(fecha.add(1, 'hours'));

                const event = {
                    "summary": `Cita con tu especialista de Diez Legal`,
                    "description": `Tienes una cita por google meet con ${rows[0].nombreAbogado}`,
                    "colorId": 1,
                    "conferenceData": {
                        "createRequest": {
                            "conferenceSolutionKey": { "type": 'hangoutsMeet' },
                            "requestId": idCita
                        }
                    },
                    "attendees": [
                        {
                            "email": rows[0].correoCliente,
                            "displayName": rows[0].nombreCliente
                        },
                        {
                            "email": rows[0].correoAbogado,
                            "displayName": rows[0].nombreAbogado,
                            "organizer": true
                        }
                    ],
                    "start": {
                        "dateTime": eventStartTime,
                    },
                    "end": {
                        "dateTime": eventEndTime,
                    }
                }

                // Envio de mensaje por whatsapp - comentado para desarrollo
                // client.sendMessage("52" + rows[0].telefonoCliente + "@c.us", whatsappMsj, 
                // (err, res) => {
                //     if (err) throw err
                //     console.log('Mensaje Enviado');
                // });

                // Crear mensaje para email
                asunto = "DIEZ LEGAL - Cita #" + idCita;
                mensaje = mensaje.replace('$1', rows[0].nombreAbogado)
                    .replace('$1', rows[0].nombreAbogado)
                    .replace('$2', rows[0].especialidades)
                    .replace('$3', moment(rows[0].fechaCita).format('LL') + ' a las ' + moment(rows[0].horaCita, 'HH:mm').format('hh:mm A'))
                    .replace('$4', rows[0].motivo)
                    .replace('$5', 'Google Meet')

                var mailOptions = {
                    from: 'contacto@franquiciat.com.mx',
                    to: [ rows[0].correoCliente, rows[0].correoAbogado ],
                    subject: asunto,
                    html: mensaje
                }

                // Envio de menjase por email
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        resolve(false);
                    } else {
                        resolve({ "idEvento": rows[0].idEvento, "idEstado": rows[0].idEstado, "calendarId": rows[0].correoAbogado, "event": event });
                    }
                });

            })
        }).then(notificacion => {
            // Envio del evento en el calendario
            if (notificacion) {
                if (tipo === 1) {
                    console.log('--ENTRO TIPO 1--');
                    calendar.events.insert({ calendarId: notificacion.calendarId, sendUpdates: 'all', resource: notificacion.event, conferenceDataVersion: 1 },
                        (err, res) => {
                            console.log(err);
                            //if (err) throw err
                            console.log('Evento Creado');
                            connet.query(updateAppointmentEventSQL, [res.data.id, idCita], function (err, rows, fields) {
                                if (err) throw err
                                connet.end();
                                return true;
                            });
                        });
                } else if (tipo === 2) {
                    calendar.events.delete({ calendarId: notificacion.calendarId, sendUpdates: 'all', eventId: notificacion.idEvento },
                        (err, res) => {
                            if (err) {
                                console.log('Evento NO encontrado');
                            } else {
                                console.log('Evento Borrado');
                            }
                            calendar.events.insert({ calendarId: notificacion.calendarId, sendUpdates: 'all', resource: notificacion.event, conferenceDataVersion: 1 },
                                (err, res) => {
                                    if (err) throw err
                                    console.log('Evento Creado');
                                    connet.query(updateAppointmentEventSQL, [res.data.id, idCita], function (err, rows, fields) {
                                        if (err) throw err
                                        connet.end();
                                        return true;
                                    });
                                });
                        });
                } else if (tipo === 3) {
                    calendar.events.delete({ calendarId: notificacion.calendarId, sendUpdates: 'all', eventId: notificacion.idEvento },
                        (err, res) => {
                            if (err) throw err
                            console.log('Evento Borrado');
                            connet.end();
                            return true;
                        });
                } else if (tipo === 4) {
                    connet.end();
                    return true;
                } else {
                    connet.end();
                    return false;
                }
            } else {
                connet.end();
                return false;
            }
        });

    } catch (error) {
        console.log(error);
        connet.end();
        return false;
    }

}

module.exports = {
    sendAppointmentsNotifications
}