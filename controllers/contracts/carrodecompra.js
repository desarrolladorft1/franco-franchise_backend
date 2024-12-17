const { response } = require("express")
var { dbConnecttion } = require("../../db/config");
const { getShoppinCartByClient,
        getCompraCarritoPorCliente,
        setShoppinCart,
        deleteShoppinCart,
        editShoppinCartStatusSQL,
        deleteShoppintCartAfterBuying } = require("../../SQL/contracts/carrodecompra");


const getShoppinCartPorCliente =  async (req, res = response ) =>{
    try {
        // console.log(req.body);
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getShoppinCartByClient, [ id ],
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

const getCarritoPorCliente =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getCompraCarritoPorCliente, [ id ],
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

const setShoppinCartNew =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const data = req.body;
        connet.query(setShoppinCart, [  data.idCliente,
                                        data.idProd, 
                                        data.cantidad,
                                        data.precio,
                                        data.numFirmas ],
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

async function borrarCarritoDespuesDeComprar(id, connet) {
    try {
        connet.query(deleteShoppintCartAfterBuying, [ id ] ,
        function (err, rows, fields) {
            if (err) throw err
            return true;
        });
    } catch (error) {
        console.log(error);
        return false;
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
    getShoppinCartPorCliente,
    getCarritoPorCliente,
    setShoppinCartNew,
    setShoppinCartDelete,
    editShoppinCartStatus,
    borrarCarritoDespuesDeComprar
}
  