var Openpay = require('openpay');
const { response } = require("express")
require("dotenv").config();

const openpayNewCustomer =  async (req, res = response ) =>{
    try {
        const { name,email,last_name,phone_number } = req.body;
        var openpay = new Openpay(process.env.openpayID, process.env.openpayPrivateKey);
        openpay.setProductionReady(false);
        var customerRequest = {
            'name': name,
            'email': email,
            'last_name': last_name,
            'phone_number':phone_number,
            'requires_account': false 
        };
        openpay.customers.create(customerRequest, function(error, customer) {
            if (error){
                return res.status(error.http_code).json({"error":error})
            }
            return res.status(200).json({
                ok:true,
                data: customer
            });
        });
    } catch (error) {
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }
}

const openpayDeleteCustomer =  async (req, res = response ) =>{
    try {
        const { id } = req.body;
        var openpay = new Openpay(process.env.openpayID, process.env.openpayPrivateKey);
        openpay.setProductionReady(false);
        var customerRequest = id;
        openpay.customers.delete(customerRequest, function(error, customer) {
            if (error){
                return res.status(error.http_code).json({"error":error})
            }
            return res.status(200).json({
                ok:true,
                data: customer
            });
        });
    } catch (error) {
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }
}

const openpayNewCharges =  async (req, res = response ) =>{
    try {
        const { 
                customerId,
                name,
                email,
                idTransaccion,
                neto,
                type } = req.body;
        
        let tabname = ""

        if (type == "FranquiciaT") {
            tabname = "FrT-" + idTransaccion
        }else{
            tabname = idTransaccion
        }

        var openpay = new Openpay(  process.env.openpayID, 
                                    process.env.openpayPrivateKey);
        openpay.setProductionReady(false);

        // var customerId = ""
        var chargeRequest = {
            'method' : 'card',
            'amount' : neto,
            'description' : 'Cargo inicial a mi cuenta',
            'order_id' : tabname ,
            'customer' : {
                 'name' : name,
                 'email' : email
            },
           'send_email' : false,
           'confirm' : false,
           'redirect_url' : 'http://localhost:4200'
         }

        openpay.charges.create(chargeRequest, function(error, body) {
            if (error){
                console.log(error);
                return res.status(500).json({"err":error, "idTransaccion": tabname})
            }
            return res.status(200).json({
                ok:true,
                data: body
            });
        });
    } catch (error) {
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }
}

const openpayWebhook =  async (req, res = response ) =>{
    return res.status(200).json({
        ok:true,
        data: body
    });
 }

module.exports = {
    openpayNewCustomer,
    openpayDeleteCustomer,
    openpayNewCharges,
    openpayWebhook
}
  