const { response } = require("express");

const { 
    getPurchasedAppointmentsByUserSQL,
    getCompletedAppointmentsByUserSQL,
    getCanceledAppointmentsByUserSQL
} = require("../../SQL/profile/purchased-appointments");

var { dbConnecttion } = require("../../db/config");

const getPurchasedAppointmentsByUser =  async (req, res = response ) =>{

    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getPurchasedAppointmentsByUserSQL, [ id ],
        function (err, rows, fields) {
            if (err) throw err
            return res.status(200).json({
                ok:true,
                data: rows
            });
        });
        connet.end();
    } catch (error) {
        connet.end();
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }

}

const getCompletedAppointmentsByUser =  async (req, res = response ) =>{

    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getCompletedAppointmentsByUserSQL, [ id ],
        function (err, rows, fields) {
            if (err) throw err
            return res.status(200).json({
                ok:true,
                data: rows
            });
        });
        connet.end();
    } catch (error) {
        connet.end();
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }

}

const getCanceledAppointmentsByUser =  async (req, res = response ) =>{

    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getCanceledAppointmentsByUserSQL, [ id ],
        function (err, rows, fields) {
            if (err) throw err
            return res.status(200).json({
                ok:true,
                data: rows
            });
        });
        connet.end();
    } catch (error) {
        connet.end();
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }

}

module.exports = {
    getPurchasedAppointmentsByUser,
    getCompletedAppointmentsByUser,
    getCanceledAppointmentsByUser
}