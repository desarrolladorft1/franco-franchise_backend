const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const { prismaConnection } = require("./db/config");

var https = require('https');
var http = require('http');

const { PROXY_CONFIG } = require("./proxy");
const path = require("path");

require("dotenv").config();

// Crear Servidor
const app = express();

// Test de conexion
prismaConnection()


PROXY_CONFIG
//Directorio Publico
app.use(express.static("public"))
app.use('/constant/', express.static('constant'))
app.use('/uploads/', express.static('uploads'))
app.use('/uploads/uploads/', express.static('uploads'))

//Directorio Publico
app.use(express.static("public"))
app.use('/img/', express.static('img'))




// CORS
app.use(cors())


// Lectura y parseo del body
app.use(express.json())

// Uso de upload files
app.use(fileUpload());

// Rutas - Global
app.use( "/api/auth", require("./routes/auth"));
app.use( "/api/omnibus", require("./routes/omnibus/locations"));
app.use( "/api/shoppinCart", require("./routes/contracts/carrodecompra"));

// Rutas - Contracts
app.use( "/api/products", require("./routes/contracts/productos"));
app.use( "/api/transactions", require("./routes/contracts/transacciones"));

// Rutas Appointments
app.use( "/api/lawyers", require("./routes/appointments/lawyers"));
app.use( "/api/appointments", require("./routes/appointments/appointments"));
app.use( "/api/agenda", require("./routes/appointments/agenda"));

// Rutas Profile
app.use( "/api/profile/services", require("./routes/profile/purchased-services"));
app.use( "/api/profile/appointments", require("./routes/profile/purchased-appointments"));
app.use( "/api/profile/lawyers", require("./routes/profile/lawyers"));

//Users
app.use( "/api/auth", require("./routes/auth"));
app.use( "/api/users", require("./routes/usuarios"));
app.use( "/api/openpayApi", require("./routes/openpay"));

//contacto
app.use( "/api/contacto", require("./routes/contacto/contacto"));
app.use( "/api/contacto", require("./routes/contacto/financiamiento"));

//marcas
app.use( "/api/marcas", require("./routes/marcas"));

// Rutas - Courses
app.use( "/api/courses", require("./routes/courses/productos"));
app.use( "/api/courses", require("./routes/courses/certificados"));
app.use( "/api/courses/SC", require("./routes/courses/carrodecompra"));
app.use( "/api/courses/transacciones", require("./routes/courses/transacciones"));

//Excel
app.use( "/api/excel", require("./routes/excel"));


app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/public/index.html"));
});
// app.listen( process.env.PORT_HTTPS, '127.0.0.1', () =>{
//     console.log( `Servidor corriendo en el puerto ${process.env.PORT_HTTPS}`);
// });



//Puerto
http.createServer(app).listen( process.env.PORT_HTTP, () =>{
  console.log( `Servidor corriendo en el puerto ${process.env.PORT_HTTP}`);
}); 

app.use((req,res,next) =>{
  if (req.protocol === "http") {
    res.redirect(301, `https://${req.header.host}${req.url}`) 
  }
})

const fs = require('fs');
 var key = fs.readFileSync('./SSL/franquiciat.local.key');
 var cert = fs.readFileSync('./SSL/franquiciat.local.crt') ;
 var options = {
   key: key,
   cert: cert
  };


// https.createServer(options, app).listen( process.env.PORT_HTTPS, () =>{
  
//       console.log( `Servidor corriendo en el puerto ${process.env.PORT_HTTPS}`);
//   });
 