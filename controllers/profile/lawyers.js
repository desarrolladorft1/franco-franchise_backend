const { response } = require("express");

const { 
    getFavoriteLawyersByIdSQL,
    getLawyerIdByUserIdSQL,
} = require("../../SQL/profile/lawyers");

var { dbConnecttion } = require("../../db/config");

const getFavoriteLawyersById =  async (req, res = response ) =>{

    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getFavoriteLawyersByIdSQL, [ id ],
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

const getLawyerIdByUserId =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        data = req.body;
        let userId = data.userId;
        if (userId == null || userId == undefined) {
            userId = -1;
        }
        connet.query(getLawyerIdByUserIdSQL, [userId],
        function (err, rows, fields) {
            if (err) throw err
            return res.status(200).json({
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
}


module.exports = {
    getFavoriteLawyersById,
    getLawyerIdByUserId,
}