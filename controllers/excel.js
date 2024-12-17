const XLSX = require("xlsx");
const { response } = require("express");
const fs = require('fs');
const { prisma } = require("./../db/config");
const ExcelJS = require("exceljs")


const crearExcelInversionInicial = async (req, res = response) => {
    const data = req.body;
    const workbook = new ExcelJS.Workbook();

    try {
        // Cargar el archivo Excel existente
        await workbook.xlsx.readFile(`${__dirname}/../excel/Perfil_Financiero_para_Franquicias_formato_vacio.xlsx`);

        // Seleccionar la primera hoja del archivo
        const hoja = workbook.getWorksheet('Inversión inicial');

        if (!hoja) {
            throw new Error('Error al cargar la hoja de cálculo');
        }

        // Escribir valores en celdas específicas
        // 1. Obra de Remodelación e Instalaciones
        // Inversión Mínima
        hoja.getCell('C6').value = Number(data.remodelacionAcondicionMin); // Garantiza que sea numérico
        hoja.getCell('C7').value = Number(data.proyectoArquitectonicoMin);
        // Inversion Máxima
        hoja.getCell('E6').value = Number(data.remodelacionAcondicionMax);
        hoja.getCell('E7').value = Number(data.proyectoArquitectonicoMax);

        // 2. Equipamiento y Mobiliario
        // Inversión Mínima
        // hoja.getCell('E7').value = Number(data.sillasysillones);



        // Configurar el recalculo automático al abrir en Excel
        workbook.calcProperties.fullCalcOnLoad = true;

        // Guardar el archivo Excel con los cambios
        const archivoExcel = `${__dirname}/../excel/perfilActualizado_User${data.idUsuario}.xlsx`;
        await workbook.xlsx.writeFile(archivoExcel);

        console.log("Datos llenos en el archivo Excel.");
        res.status(200).json({
            msg: "Excel generado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Algo salió mal",
            error: error.message
        });
    }
};

module.exports = {
    crearExcelInversionInicial
}