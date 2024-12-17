const { response } = require("express");
var axios = require("axios").default;
require('dotenv').config();

async function revalidarToken() {
    const promiseToRefresTokem = function (resolve, reject) {
        var options = {
            method: 'POST',
            url: `https://${process.env.AUTH0_DOMAIN}.us.auth0.com/oauth/token`,
            headers: { 'content-type': 'application/json' },
            data: { 
                client_id: process.env.AUTH0_CLIENT_ID_TOKEN, 
                client_secret: process.env.AUTH0_CLIENT_SECRET_TOKEN, 
                audience: process.env.AUTH0_AUDIENCE,
                grant_type: "client_credentials" 
            }
        };

        axios.request(options).then(function (response) {
            //console.log(response.data);
            resolve(response.data)
        }).catch(function (error) {
            // console.error(error);
            reject(error)
        });
    }

    return new Promise(promiseToRefresTokem);
}

const getAllRoleUsuario = async (req, res = response) => {
    console.log("/api/auth/AllRole");
    try {
        let roles = await revalidarToken().then(async value => {
            if (value) {
                var options = {
                    method: 'GET',
                    url: 'https://dev-3jkzw1ri.us.auth0.com/api/v2/roles',
                    headers: { "Authorization": `Bearer ${value.access_token}` }
                };
                return await axios.request(options).then(function (response) {
                    // console.log(response.data);
                    return response.data
                })
            }
        })
        return res.status(200).json({
            ok: true,
            data: roles
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: error
        });
    }
}


const getRoleUser = async (req, res = response) => {
    console.log("/api/auth/UserRole");
    try {
        const { idAPIAUTH } = req.body;
        console.log(idAPIAUTH);
        let roles = await revalidarToken().then(async value => {
            if (value) {
                console.log("Si valido el token");
                
                var options = {
                    method: 'GET',
                    url: `${process.env.AUTH0_AUDIENCE}users/${idAPIAUTH}/roles`,
                    headers: { "Authorization": `Bearer ${value.access_token}` }
                };
                return await axios.request(options).then(function (response) {
                    // console.log(response.data);
                    return response.data
                })
            }
        })
        return res.status(200).json({
            ok: true,
            data: roles
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

  const crearUsuario = (req, res = response) =>{
     const {email,name,password} = req.body;
     try {
     } catch (error) {
         return  res.status(500).json( {
             ok:false,
             msg:"Algo salio mal"
         });
     }
 }

 const loginUsuario = (req, res = response ) =>{
     const {email,password} = req.body;
     return  res.status(200).json( {
         ok:true,
         msg:"Login de usuario"
     });
 }


module.exports = {
    getAllRoleUsuario,
    getRoleUser,
    crearUsuario,
    loginUsuario
}
