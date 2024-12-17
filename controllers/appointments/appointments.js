const { response } = require("express");
const fs = require('fs');
const { prisma } = require("../../db/config");

const {
    setPurchasedAppointmentInStateSQL,
    increaseAvailabilityByAppointmentIdSQL,
    addNewAppointmentReviewSQL,
    setAppointmentAsReviewedSQL,
    getAppointmentStateByAppointmentIdSQL,
    updateAppointmenStateSQL,
    increaseReScheduledCounterSQL,
    changeAppointmentHourDateSQL,
    decreaseAvailabilitySQL,
    getAppointmenStateIdByAbbreviationSQL,
    setNewAppointmentSQL,
    setAppointmentContactInformationSQL,
    getDatesLawyerSQL


} = require("../../SQL/appointments/appointments");

const { sendAppointmentsNotifications } = require("../../funtions/appointments");

const appointmentState = {
    PAYMENT_PENDING: "PPP",
    PAYMENT_REJECTED: "PR",
    BOOKED: "A",
    CLOSED: "F",
    RE_BOOKED: "RA",
    SUSPENDED: "S",
    REFUNDED: "R"
}

var { dbConnecttion } = require("../../db/config");

const getDatesLawyer = async (req, res) => {
    const { lawyer_id, fecha_cita } = req.body;
    let connet = await dbConnecttion();

    try {
        connet.query(getDatesLawyerSQL, [
            lawyer_id,
            fecha_cita
        ],
        function (err, rows, fields) {
            if (err) throw err
            return res.status(200).json( {
                ok:true,
                data: rows
            });
        });
        connet.end();
    } catch (error) {
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }

    
};


const getDatesInavailable = async (req, res = response) => {
    const { abogadoId } = req.body;
    try {
        const citas = await prisma.citas.findMany({
            where: {
              abogado_id: parseInt(abogadoId, 10),
            },
            select: {
              hora_dia_inicio: true,
              hora_dia_fin: true,
            },
          });
        res.status(200).json({ success: true, data: citas });
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las citas' });
    }

}



const setPurchasedAppointmentInSuspendedState = async (req, res = response) => {

    let connet;

    try {
        connet = await dbConnecttion();
        connet.beginTransaction();
        appointmentStateAbbreviation = appointmentState.SUSPENDED;
        data = req.body;

        connet.query(setPurchasedAppointmentInStateSQL, [appointmentStateAbbreviation, data.citaId],
            function (err, rows, fields) {
                if (err) throw err
            });
        connet.query(increaseAvailabilityByAppointmentIdSQL, [data.citaId],
            function (err, rows, fields) {
                if (err) throw err
                return res.status(200).json({
                    ok: true,
                    data: rows
                });
            });
        connet.commit();
        sendAppointmentsNotifications(data.citaId, connet, 3);
    } catch (error) {
        connet.rollback();
        connet.end();
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const setPurchasedAppointmentInCanceledState = async (req, res = response) => {

    let connet;

    try {
        connet = await dbConnecttion();
        connet.beginTransaction();
        appointmentStateAbbreviation = appointmentState.REFUNDED;
        data = req.body;

        connet.query(setPurchasedAppointmentInStateSQL, [appointmentStateAbbreviation, data.citaId],
            function (err, rows, fields) {
                if (err) throw err
                return res.status(200).json({
                    ok: true,
                    data: rows
                });
            });
        connet.commit();
        sendAppointmentsNotifications(data.citaId, connet, 4);
    } catch (error) {
        connet.rollback();
        connet.end();
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const saveNewAppointmentReview = async (req, res = response) => {

    let connet;

    try {
        connet = await dbConnecttion();
        connet.beginTransaction();
        data = req.body;
        appointmentId = data.citaId;
        lawyerId = data.lawyerId;
        userId = data.userId;
        starsQty = data.stars;
        reviewText = data.ratingText;
        console.log('stars ', starsQty);
        new Promise((resolve, reject) => {
            connet.query(addNewAppointmentReviewSQL, [ starsQty, reviewText, lawyerId, userId ],
                function (err, rows, fields) {
                    if (err) throw err
                    resolve(rows);
                })
        }).then(rows => {
            if (rows) {
                connet.query(setAppointmentAsReviewedSQL, [ appointmentId ],
                    function (err, rows, fields) {
                        if (err) throw err
                        return res.status(200).json({
                            ok: true,
                            data: rows
                        });
                    });
                connet.commit();
                connet.end();
            }
        });

    } catch (error) {
        console.log(error);
        connet.rollback();
        connet.end();
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const changeAppointmentDate = async (req, res = response) => {
        
    let connet;

    try {
        connet = await dbConnecttion();
        data = req.body;
        citaId = data.citaId;
        newHoraCitaId = data.newHoraCitaId;
        incrementarContador = data.addCouunt;
        oldHoraCitaId = -1;
        connet.beginTransaction();
        new Promise((resolve, reject) => {
            connet.query(getAppointmentStateByAppointmentIdSQL, [citaId],
                function (err, rows, fields) {
                    if (err) throw err
                    resolve(rows[0]);
                })
        }).then(stateData => {
            if (stateData) {
                //solo incrementaremos la disponibilidad de horarios para citas que estaban agendadas o reagendadas, y no suspendidas
                if(stateData.abreviacion===appointmentState.BOOKED || stateData.abreviacion===appointmentState.RE_BOOKED) {
                    connet.query(increaseAvailabilityByAppointmentIdSQL, [citaId],
                        function (err, rows, fields) {
                            if (err) throw err 
                        });
                }
                //Decrementamos la disponibilidad del horaCita al que moveremos la cita
                connet.query(decreaseAvailabilitySQL, [newHoraCitaId],
                    function (err, rows, fields) {
                        if (err) throw err 
                    });
                    
                    connet.query(updateAppointmenStateSQL, [appointmentState.RE_BOOKED, citaId],
                    function (err, rows, fields) {
                        if (err) throw err 
                    });

                //incrementamos el contador de veces que la cita se ha re-agendado
                if(incrementarContador) {
                    connet.query(increaseReScheduledCounterSQL, [citaId],
                        function (err, rows, fields) {
                            if (err) throw err
                        }
                    );
                }
                //Movemos la cita de espacio horario
                connet.query(changeAppointmentHourDateSQL, [newHoraCitaId, citaId],
                        function (err, rows, fields) {
                            if (err) throw err
                            return res.status(200).json({
                                ok: true,
                                data: rows
                            });
                        });
                                        
                connet.commit();
                sendAppointmentsNotifications(data.citaId, connet, 2);
            }
        });

    } catch (error) {
        connet.rollback();
        connet.end();
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const setNewAppointment = async (req, res = response) => {
    
    let connet;

    try {
        connet = await dbConnecttion();

        appointmentStateAbbreviation = appointmentState.PAYMENT_PENDING;
        data = req.body;
        new Promise((resolve, reject) => {
            connet.query(decreaseAvailabilitySQL, [data.horarioCitaId],
                function (err, rows, fields) {
                    if (err) throw err
                    resolve(true);
                })
        }).then(value => {
            if (value) {

                new Promise((resolve, reject) => {
                    connet.query(getAppointmenStateIdByAbbreviationSQL, [appointmentStateAbbreviation],
                        function (err, rows, fields) {
                            if (err || rows[0].id <= 0) throw err 
                            resolve(rows[0].id);
                        });
                }).then(stateId => {
                    if (stateId) {
                        connet.query(setNewAppointmentSQL, [data.horarioCitaId,
                        data.lawyerId,
                        data.costumerId,
                        data.serviceLawyerId,
                        stateId,
                        data.costumerId,
                        data.costumerId],
                        function (err, rows, fields) {
        
                            console.log('Error ',err);
                            if (err) throw err
                            return res.status(200).json({
                                ok: true,
                                data: rows
                            });
                        });
                    }
                    connet.end();
                });
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


const setAppointmentContactInformation = async (req, res = response) => {
    let connet;
    try {
        connet = await dbConnecttion();
        data = req.body;
        new Promise((resolve, reject) => {
            connet.query(setAppointmentContactInformationSQL, 
                        [
                        data.idCita, 
                        data.customerId, 
                        data.nombres,
                        data.apellidos,
                        data.motivo,
                        data.correo,
                        data.telefono
                        ],
                function (err, rows, fields) {
                    if (err) throw err
                    return res.status(200).json({
                        ok: true,
                        data: rows
                    });
                })
            connet.end();
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const changeAppointmentDateStatus =  async (req, res = response ) =>{
    try {
        console.log("changeAppointmentDateStatus");
        let connet = await dbConnecttion();
        const data = req.body;
        console.log(data);
        connet.query(updateAppointmenStateSQL, [appointmentState.BOOKED, data.citaId],
            function (err, rows, fields) {
                if (err) throw err
                return res.status(200).json({
                    ok: true,
                    data: rows
                });
            });
        connet.end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

module.exports = {
    setPurchasedAppointmentInSuspendedState,
    setPurchasedAppointmentInCanceledState,
    saveNewAppointmentReview,
    changeAppointmentDate,
    setNewAppointment,
    setAppointmentContactInformation,
    changeAppointmentDateStatus,
    getDatesLawyer,
    getDatesInavailable

}