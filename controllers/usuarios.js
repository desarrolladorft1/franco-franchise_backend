const { response } = require("express")
var { dbConnecttion } = require("../db/config");
const { 
    setUser, 
    setUserDetails, 
    getUserByKey,
    editUserDetailSQL,
    getNonLawyerUsersSQL
} = require("../SQL/usuarios");

const setUsuario =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const data = req.body;
        
        new Promise((resolve, reject) => {
            connet.query(setUser, [ data.nickname, data.email, data.sub1, data.sub2 ],
                function (err, rows, fields) {
                    if (err) throw err
                    resolve({
                        ok:true,
                        data: rows
                    })
                });
        }).then(value => {
            if (value) {
                if(value.data.insertId !== 0) {
                    connet.query(setUserDetails, [ value.data.insertId, 
                                                   data.nickname, 
                                                   data.email, 
                                                   value.data.insertId ],
                        function (err, rows, fields) {
                            if (err) throw err
                            return res.status(200).json( {
                                ok:true,
                                data: value
                            });
                        });
                }else{
                    return res.status(200).json( {
                        ok:true,
                        data: data
                    });
                }
                connet.end();
            }
        })

    } catch (error) {
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }
}

const getUsuarioPorKey =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { key } = req.body;
        connet.query(getUserByKey, [ key ],
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

const editUserDetail =  async (req, res = response ) =>{
    try {
        const {
            nombre,
            apellido,
            telefono,
            provincia,
            ciudad,
            direccion,
            codigoPostal,
            fechaNacimiento,
            idUsuario
        } = req.body;


        let connet = await dbConnecttion();
        connet.query(editUserDetailSQL, [  nombre,
                                        apellido,
                                        telefono,
                                        provincia,
                                        ciudad,
                                        direccion,
                                        codigoPostal,
                                        fechaNacimiento,
                                        idUsuario ],
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

const getNonLawyerUsers =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        connet.query(getNonLawyerUsersSQL,
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
    setUsuario,
    getUsuarioPorKey,
    editUserDetail,
    getNonLawyerUsers
}