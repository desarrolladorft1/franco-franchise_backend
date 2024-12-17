const { response } = require("express")
var { dbConnecttion } = require("../../db/config");
const { getAllProductsDetails,
        getOneProductsDetails,
        getOneSubProductsDetails,
        getProductsByTypes, 
        getUsersAll} = require("../../SQL/contracts/productos");

const getAllProductoDetalleSQL =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        // const { id } = req.body;
        connet.query(getAllProductsDetails,
        function (err, rows, fields) {
            if (err) throw err
            rows.forEach(producto => {
                // producto.categorias = producto.categorias.split(',')
                producto.benefits = producto.benefits.split('##')
            })
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

const getAllUsersDetalleSQL =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        // const { id } = req.body;
        connet.query(getUsersAll,
        function (err, rows, fields) {
            if (err) throw err
            //rows.forEach(usuarios => {
                // producto.categorias = producto.categorias.split(',')
                //usuarios.benefits = usuarios.benefits.split('##')
            //})
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

const getOneProductoDetalle =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getOneProductsDetails, [ id ],
        function (err, rows, fields) {
            rows.forEach(producto => {
                // producto.categorias = producto.categorias.split(',')
                producto.benefits = producto.benefits.split('##')
            })
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

const getOneSubProductsDetailsSQL =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getOneSubProductsDetails, [ id ],
        function (err, rows, fields) {
            // rows.forEach(producto => {
            //     // producto.categorias = producto.categorias.split(',')
            //     producto.benefits = producto.benefits.split('##')
            // })
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

const getProductosPorTipo =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { tipo } = req.body;
        connet.query(getProductsByTypes, [ tipo ],
        function (err, rows, fields) {
            rows.forEach(producto => {
                producto.categorias = producto.categorias.split(',')
                producto.beneficios = producto.beneficios.split('##')
            })
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
    getAllProductoDetalleSQL,
    getOneProductoDetalle,
    getOneSubProductsDetailsSQL,
    getProductosPorTipo,
    getAllUsersDetalleSQL
}
    