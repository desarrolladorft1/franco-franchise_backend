const { response } = require("express");
const fs = require('fs');

const {
    getAppointmentsByLawyerIdSQL,
    getAppointmentsByDatesAndLawyerIdSQL,
    getRangeIdAndRangeDetailIdByDateSQL,
    setDateRangeScheduleDetailsSQL,
    setDateRangeScheduleSQL,
    deleteAppointmentScheduledByIdSQL,
    getMissingRangesDateSQL,
    setAppointmentScheduleSQL,
} = require("../../SQL/appointments/agenda");

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

const getAppointmentsByLawyerId = async (req, res = response) => {
    
    let connet;
    
    try {
        connet = await dbConnecttion();
        connet.beginTransaction();
        appointmentStateAbbreviation = appointmentState.REFUNDED;
        data = req.body;

        connet.query(getAppointmentsByLawyerIdSQL, [data.lawyerId],
            function (err, rows, fields) {
                if (err) return res.status(500).json({Message: "errorInterno"}) 
                    
                return res.status(200).json({
                    ok: true,
                    data: rows
                });
            });
        connet.commit();
        connet.end();
    } catch (error) {
        connet.rollback();
        connet.end();
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const getAppointmentsByDatesAndLawyerId = async (req, res = response) => {
    
    let connet;
    
    try {
        connet = await dbConnecttion();
        connet.beginTransaction();
        data = req.body;
        connet.query(getAppointmentsByDatesAndLawyerIdSQL, [data.startDate, data.endDate, data.lawyerId],
            function (err, rows, fields) {
                if (err) throw err
                return res.status(200).json({
                    ok: true,
                    data: rows
                });
            });
            connet.commit();
        connet.end();
    } catch (error) {
        connet.rollback();
        connet.end();
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const setSchedule = async (req, res = response) => {

    let connet;

    try {
        connet = await dbConnecttion();
        data = req.body;
        startDate = data.startDate;
        endDate = data.endDate;
        schedule = data.schedule;
        lawyerId = data.lawyerId;
        let i = 0;
        let esperando;
        let allRows = [];

        connet.beginTransaction();
        for await (const day of schedule) {
        //schedule.forEach( async (day) => {


            await new Promise((resolve, reject) => {
                connet.query(getRangeIdAndRangeDetailIdByDateSQL, [day.date, lawyerId, day.date],
                    function (err, rows, fields) {
                        if (err) throw err 
                        if(rows[0].rango_detalle_id === null) {
                            connet.query(setDateRangeScheduleDetailsSQL, [rows[0].rango_id, day.date],
                                function (err, rows, fields) {
                                    if (err) throw err 
                                    allRows.push(rows)
                                    resolve(rows.insertId)
                                });
                        } else {
                            //retornar el ID del rango_detalle
                            resolve(rows[0].rango_detalle_id);
                        }
                    });
            }).then(async (rango_detalleId) => {
                //CREAR EL HORARIO_CITA
                
                if (rango_detalleId) {
                    for await (const hour of day.hours){
                    //day.hours.forEach( async (hour) => {
                        let horaId = parseInt(hour.split(':')[0]);
                        connet.query(setAppointmentScheduleSQL, [rango_detalleId, horaId],
                            function (err, rows, fields) {
                                if (err) throw err
                                allRows.push(rows)
                            });
                    };
                    
                } else {
                    connet.commit();
                    connet.end();
                    return res.status(500).json({
                        ok: false,
                        msg: "Algo salio mal"
                    });
                } 
            });
            
        }; 
        connet.commit();
        connet.end();
        return res.status(200).json({
            ok: true,
            data: allRows
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

const getMissingRangesDate = async (req, res = response) => {

    let connet;

    try {
        connet = await dbConnecttion();
        data = req.body;
        startDate = data.startDate;
        endDate = data.endDate;
        lawyerId = data.lawyerId;
        missingDates = [];
        let allRows = [];

        connet.beginTransaction();
        await new Promise((resolve, reject) => {
            connet.query(getMissingRangesDateSQL, [startDate, lawyerId, startDate, lawyerId, endDate],
                function (err, rows, fields) {
                    if (err) throw err
                    resolve(rows);
                })
        }).then( async dates => {
            if (dates) {
                let abierto = false;
                let cerrado = false;
                let inicioIntervalo;
                let finIntervalo;
                let data;
                for await (const date of dates) {
                //await dates.forEach(date => {
                    if (date.dim_rangos_horarios_id === null) {
                        if (!abierto) {
                            abierto = true;
                            inicioIntervalo = date.fecha;
                            finIntervalo = date.fecha;
                        } else {
                            finIntervalo = date.fecha;
                        }
                    } else {
                        if (abierto) {
                            abierto = false;
                            data = {
                                id: lawyerId,
                                desde: inicioIntervalo,
                                hasta: finIntervalo
                            }
                            missingDates.push(data);
                        }
                    }
                };
                if (abierto) {
                    abierto = false;
                    data = {
                        id: lawyerId,
                        desde: inicioIntervalo,
                        hasta: finIntervalo
                    }
                    missingDates.push(data);
                }
                if (missingDates.length > 0 ) {
                    for await (const date of missingDates) {
                    //await missingDates.forEach( async (date) => {
                        connet.query(setDateRangeScheduleSQL, [date.id, date.desde, date.hasta],
                            function (err, rows, fields) {
                                if (err) throw err
                                allRows.push(rows);
                            })
                    }
                    
                    // connet.commit();
                    // connet.end();
                    // return res.status(200).json({
                    //     ok: true,
                    //     data: allRows
                    // });
                }
            }
        });
        
        connet.commit();
        connet.end();
        return res.status(200).json({
            ok: true,
            data: allRows
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

const deleteAppointmentScheduledById = async (req, res = response) => {
                                
    let connet;

    try {
        connet = await dbConnecttion();
        connet.beginTransaction();
        data = req.body;

        connet.query(deleteAppointmentScheduledByIdSQL, [data.appointmentId],
            function (err, rows, fields) {
                if (err) throw err
                return res.status(200).json({
                    ok: true,
                    data: rows
                });
            });
        connet.commit();
        connet.end();
    } catch (error) {
        connet.rollback();
        connet.end();
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}



module.exports = {
    getAppointmentsByLawyerId,
    getAppointmentsByDatesAndLawyerId,
    getMissingRangesDate,
    deleteAppointmentScheduledById,
    setSchedule,
}