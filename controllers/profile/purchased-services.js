const { response } = require("express");

const { 
    getPurchasedServicesByUserSQL
} = require("../../SQL/profile/purchased-services");

var { dbConnecttion } = require("../../db/config");

const getPurchasedServicesByUser =  async (req, res = response ) =>{

    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getPurchasedServicesByUserSQL, [ id ],
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
    getPurchasedServicesByUser
}