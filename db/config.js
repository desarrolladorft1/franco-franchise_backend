const { PrismaClient } = require('@prisma/client');
var mysql = require('mysql2')

const dbConnecttion = async() => {

    try {
        const connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.mySQL_User,
            password: process.env.mySQL_Password,
            database: process.env.mySQL_Name
          })

          await connection.connect()
          console.log("DB Online");
          return connection
   
    } catch (error) {
        console.log("Error");
        throw new Error("Error al momento de inicializad DB")
    }

}

const prisma = new PrismaClient();
const prismaConnection = async () => {
    try {
        prisma.$connect();
        console.log("Prisma OK");
        
    } catch (error) {
        console.log("Error al conectar prisma");
        throw error;
    }
}

module.exports = {
    dbConnecttion,
    prismaConnection,
    prisma, 
}