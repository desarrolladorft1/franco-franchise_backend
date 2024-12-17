const { response } = require("express")
var { dbConnecttion } = require("../../db/config");
const { getTransactionsDetailsByClientCourses, 
        guathCheckCoursesSQL,
        getTransactionsDetailsByClientCoursesSpecify
     } = require("../../SQL/courses/transacciones");


const getTransactionesDetallesPorClienteCourses =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        connet.query(getTransactionsDetailsByClientCourses, [ id ],
        function (err, rows, fields) {
            if (err) throw err
            rows.forEach(producto => {
                if (producto.learn != null) {
                    producto.learn = producto.learn.split('*--*')
                }
                if (producto.requirements != null) {
                    producto.requirements = producto.requirements.split('*--*')
                }
          
                if (producto.includes != null) {
                    producto.includes = producto.includes.split('*--*')
                }
                if (producto.course_for != null) {
                    producto.course_for = producto.course_for.split('*--*')
                }
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

const getTransactionsDetailsByClientCoursesSpecifyOne =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { idCliente , idProducto } = req.body;
        // console.log(req.body);
        connet.query(getTransactionsDetailsByClientCoursesSpecify, [ idCliente, idProducto ],
        function (err, rows, fields) {
            if (err) throw err
            rows.forEach(producto => {
                if (producto.learn != null) {
                    producto.learn = producto.learn.split('*--*')
                }
                if (producto.requirements != null) {
                    producto.requirements = producto.requirements.split('*--*')
                }
          
                if (producto.includes != null) {
                    producto.includes = producto.includes.split('*--*')
                }
                if (producto.course_for != null) {
                    producto.course_for = producto.course_for.split('*--*')
                }
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

const guathCheckCourses =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { idCliente, idProducto } = req.body;
        connet.query(guathCheckCoursesSQL, [idCliente,idProducto],
        function (err, rows, fields) {
            // console.log(rows);
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
    getTransactionesDetallesPorClienteCourses,
    guathCheckCourses,
    getTransactionsDetailsByClientCoursesSpecifyOne
}
  