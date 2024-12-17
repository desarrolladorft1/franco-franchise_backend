const { response } = require("express")
var { dbConnecttion } = require("../../db/config");
const { setShoppinCart,
        deleteShoppinCart,
        editShoppinCartStatusSQL } = require("../../SQL/contracts/carrodecompra");


const setShoppinCartNew =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const data = req.body;
        connet.query(setShoppinCart, [  data.idCliente,
                                        data.idProd, 
                                        data.cantidad,
                                        data.precio ],
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
}

const setShoppinCartDelete =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { ids } = req.body;
        connet.query(deleteShoppinCart, [ ids ] ,
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
}

const editShoppinCartStatus =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const data = req.body;
        connet.query(editShoppinCartStatusSQL, [ data.carrodecompras_id ],
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
}

module.exports = {
    setShoppinCartNew,
    setShoppinCartDelete,
    editShoppinCartStatus
}
  