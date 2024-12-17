const { response } = require("express");

const { 
    getStatesSQL, 
    getMunicipalitiesSQL
} = require("../../SQL/omnibus/locations");

var { dbConnecttion } = require("../../db/config");

const getStates =  async (req, res = response ) =>{

    try {
        let connet = await dbConnecttion();
        connet.query(getStatesSQL, 
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

const getMunicipalities =  async (req, res = response ) =>{

    try {
        let connet = await dbConnecttion();
        connet.query(getMunicipalitiesSQL, 
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
    getStates,
    getMunicipalities
}