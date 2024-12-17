const { response } = require("express");
const fs = require('fs');
const { prisma } = require("../../db/config");

const { 
    getLawyerSpecialtiesSQL,
    setLawyerImageUrlSQL,
    setLawyerInfoSQL,
    setLawyerSpecialtiesSQL,
    setLawyerExperienceSQL,
    setLawyerTrainingSQL,
    setLawyerSevicePriceSQL,
    setLawyerServiceSQL,
    getLawyersByFilterSQL,
    createFavoriteLawyerSQL,
    deleteFavoriteLawyerSQL,
    getLawyerScheduleByIdSQL,
    getLawyerByIdSQL,
} = require("../../SQL/appointments/lawyers");

var { dbConnecttion } = require("../../db/config");

const getEspecialidades = async (req, res = response) => {

    try {
        const { dim_especialidades_abogados } = prisma;
        const results = await dim_especialidades_abogados.findMany({
            select: {
                dim_especialidades_abogados_nombre: true,
                dim_especialidades_abogados_id: true,
            }
        });

        res.json({
            results: results.map(e => {
                return {
                    name: e.dim_especialidades_abogados_nombre,
                    value: e.dim_especialidades_abogados_id
                }
            })
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}

const setLawyer = async (req, res = response ) =>{

    let connet = await dbConnecttion();

    try {

        let imagen = req['files'].imagen;
        let curriculum = req['files'].curriculum;

        let data = {
            "idUsuario": req.body.idUsuario,
            "nombres": req.body.nombres,
            "apellidos": req.body.apellidos,
            "identificacion": req.body.identificacion,
            "cedula": req.body.cedula,
            "usuario": req.body.usuario,
            "fechanacimiento": req.body.fechanacimiento,
            "telefono": req.body.telefono,
            "correo": req.body.correo,
            "estado": req.body.estado,
            "ciudad": req.body.ciudad,
            "direccion": req.body.direccion,
            "codigopostal": req.body.codigopostal,
            "descripcion": req.body.descripcion,
            "formacion": req.body.formacion,
            "especialidad": req.body.especialidad,
            "experiencia": req.body.experiencia,
            "precio": req.body.precio
        };

        const pathUrl = `../franquiciat-frontend-v2/src/assets/lawyers/${data.nombres} ${data.apellidos} - ${data.cedula}`;
        const imagenUrl = `${pathUrl}/abogado.${imagen.mimetype.replace('image/', '')}`;
        const curriculumUrl = `${pathUrl}/abogado.pdf`;

        fs.mkdir(pathUrl, { recursive: true }, (err) => {
            if (err) throw err;
            fs.writeFile(imagenUrl, imagen.data, function (err) {
                if (err) return console.log(err);
            });
            fs.writeFile(curriculumUrl, curriculum.data, function (err) {
                if (err) return console.log(err);
            });
        });

        var dataUrl = [];
        var dataAbogado = [];
        var dataEspecialidades = [];
        var dataFormacion = [];
        var dataExperiencia = [];

        dataUrl.push([ imagenUrl.replace('../franquiciat-frontend-v2/src/', '') ]);

        connet.beginTransaction();
        new Promise((resolve, reject) => {
            connet.query(setLawyerImageUrlSQL, [ dataUrl ],
            function (err, rows, fields) {
                if (err) throw err
                resolve({ ok: true, data: rows })
            });
            connet.commit();
        }).then(url => {
            if(url) {

                dataAbogado.push([
                    data.idUsuario,
                    data.identificacion,
                    data.nombres,
                    data.apellidos,
                    data.cedula,
                    data.usuario,
                    data.correo,
                    data.fechanacimiento,
                    data.telefono,
                    data.estado,
                    data.ciudad,
                    data.direccion,
                    data.codigopostal,
                    url.data.insertId,
                    data.descripcion
                ]);

                new Promise((resolve, reject) => {
                    connet.query(setLawyerInfoSQL, [ dataAbogado ],
                    function (err, rows, fields) {
                        if (err) throw err
                        resolve({ ok: true, data: rows })
                    });
                    connet.commit();
                }).then(lawyer => {
                    if(lawyer) {
                        
                        data.especialidad.split(',').forEach(especialidad => {
                            dataEspecialidades.push([ lawyer.data.insertId, especialidad ]);
                        });

                        data.formacion.split(',').forEach(formacion => {
                            dataFormacion.push([ lawyer.data.insertId, formacion ]);
                        });

                        data.experiencia.split(',').forEach(experiencia => {
                            dataExperiencia.push([ lawyer.data.insertId, experiencia ]);
                        });

                        connet.query(setLawyerSpecialtiesSQL, [ dataEspecialidades ],
                        function (err, rows, fields) {
                            if (err) throw err
                        });
                        connet.commit();

                        connet.query(setLawyerExperienceSQL, [ dataExperiencia ],
                        function (err, rows, fields) {
                            if (err) throw err
                        });
                        connet.commit();

                        connet.query(setLawyerTrainingSQL, [ dataFormacion ],
                        function (err, rows, fields) {
                            if (err) throw err
                        });
                        connet.commit();

                        new Promise((resolve, reject) => {
                            connet.query(setLawyerSevicePriceSQL, [ data.precio, data.precio, data.precio ],
                                function (err, rows, fields) {
                                    if (err) throw err
                                    resolve({ ok: true, data: rows })
                                });
                            connet.commit();
                        }).then(precio => {
                            connet.query(setLawyerServiceSQL, [ lawyer.data.insertId, precio.data.insertId ],
                                function (err, rows, fields) {
                                    if (err) throw err
                                    return res.status(200).json({
                                        ok: true,
                                        data: rows
                                    });
                                });
                            connet.commit();
                            connet.end();
                        });

                    }
                });

            }
        });
    } catch (error) {
        connet.rollback();
        connet.end();
        console.log(error);
        return res.status(500).json({ ok:false, msg:"Algo salio mal" });
    }

}

const getLawyerSpecialties = async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        data = req.body;
        connet.query(getLawyerSpecialtiesSQL, [ data.pattern ],
        function (err, rows, fields) {
            if (err) throw err
            return res.status(200).json({
                ok:true,
                data: rows
            });
        });
        connet.end();
    } catch (error) {
        connet.end();
        console.log(error);
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }
}

const getLawyersByFilter = async (req, res = response) => {
    try {

        const {
            lawyerNameLastName,
            specialtyList,
            orderPrice,
            orderRating,
            userId,
        } = req.body;

        const { dim_abogados } = prisma;

        const results = await dim_abogados.findMany({
            where: lawyerNameLastName
                ? {
                    OR: [
                        { dim_abogados_nombres: { contains: lawyerNameLastName } },
                        { dim_abogados_apellidos: { contains: lawyerNameLastName } }
                    ]
                } : {},
            include: {
                dim_urls: true,
                dim_servicios: {
                    select: {
                        dim_servicios_id: true,
                        dim_servicios_nombre: true,
                        dim_servicios_descripcion: true,
                        dim_precios: {
                            select: {
                                dim_precios_neto: true,
                                dim_precios_id: true,
                            },
                        },
                    },
                },
                rel_especialidades_abogados: {
                    select: {
                        dim_especialidades_abogados: {
                            select: {
                                dim_especialidades_abogados_id: true,
                                dim_especialidades_abogados_nombre: true,
                                dim_especialidades_abogados_descripcion: true,
                            },
                        },
                    },
                },
            },
        });

        // Formatear el resultado para ajustarse a la tabla deseada
        let formattedResults = results.map(abogado => ({
            idAbogado: abogado.dim_abogados_id,
            destacado: abogado.dim_abogados_destacado,
            favorito: abogado.favorito || null,
            nombres: abogado.dim_abogados_nombres,
            apellidos: abogado.dim_abogados_apellidos,
            specialty_id: abogado.rel_especialidades_abogados.map(rel => rel.dim_especialidades_abogados.dim_especialidades_abogados_id).join(', '),
            specialty: abogado.rel_especialidades_abogados.map(rel => rel.dim_especialidades_abogados.dim_especialidades_abogados_nombre).join(', '),
            servicios: abogado.dim_servicios,
            avatar: abogado.dim_urls.dim_urls_url,
            rating: abogado.rating || 0,
            cantOpiniones: abogado.cantOpiniones || 0,
            lastReview: abogado.lastReview || 'Sin reseñas',
        }));

        formattedResults = specialtyList
            ? formattedResults.filter(e => {
                const ids = e.specialty_id.split(",").map(e => parseInt(e));
                return specialtyList.some(s => ids.includes(s));
            })
            : formattedResults;


        if (orderPrice) {
            orderPrice === "asc" && formattedResults.sort((a, b) => {
                const { dim_precios_neto: dim_precios_neto_b } = b.servicios[0].dim_precios;
                const { dim_precios_neto: dim_precios_neto_a } = a.servicios[0].dim_precios;
                return dim_precios_neto_b - dim_precios_neto_a;
            });

            orderPrice === "desc" && formattedResults.sort((a, b) => {
                const { dim_precios_neto: dim_precios_neto_a } = a.servicios[0].dim_precios;
                const { dim_precios_neto: dim_precios_neto_b } = b.servicios[0].dim_precios;
                return dim_precios_neto_a - dim_precios_neto_b;
            });
        }

        if (orderRating) {
            orderRating === "asc" && formattedResults.sort((a, b) => b.rating - a.rating);
            orderRating === "desc" && formattedResults.sort((a, b) => a.rating - b.rating);
        }

        res.json({ lawyers: formattedResults })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Algo salio mal",
            ok: false,
        });
    }
}

const createFavoriteLawyer =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        data = req.body;
        connet.query(createFavoriteLawyerSQL, [data.idlawyer, data.idclient],
        function (err, rows, fields) {
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

const deleteFavoriteLawyer =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        data = req.body;
        connet.query(deleteFavoriteLawyerSQL, [data.idlawyer, data.idclient],
        function (err, rows, fields) {
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

const getLawyerScheduleById =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const data = req.body;
        let horas = [];
        let resultDias = [];
        
        connet.query(getLawyerScheduleByIdSQL, [data.days,
                                                data.id ],
        function (err, rows, fields) {

            rows.forEach(day => {
                let resultHoras = [];
                horas = day.agendaDia.split('###')
                horas.forEach(detalleHora => {
                    let hora, agendada, disponible;
                    const detalleHoraArray = detalleHora.split('##');

                    horaCitaId = parseInt(detalleHoraArray[0]);
                    hora = detalleHoraArray[1];
                    agendada = parseInt(detalleHoraArray[2]);
                    disponible = parseInt(detalleHoraArray[3]);


                    resultHoras.push({
                        'horaCitaId': horaCitaId,
                        'hour': hora,
                        'scheduled': agendada,
                        'available': disponible
                    });
                });
                resultDias.push({
                    'date': day.fecha,
                    'hours': resultHoras
                })
            });
            if (err) throw err
            return res.status(200).json( {
                ok:true,
                data: resultDias
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

const getLawyerById = async (req, res = response) => {
    try {
        data = req.body;
        let customerUserId = data.customerUserId;
        if (customerUserId == null || customerUserId == undefined) {
            customerUserId = -1;
        }

        const abogadoData = await prisma.dim_abogados.findUnique({
            where: {
                dim_abogados_id: parseInt(data.id)
            },
            select: {
                dim_abogados_id: true,  // Alias para dim_abogados_id
                dim_abogados_licencia: true,
                dim_abogados_cedula: true,
                dim_abogados_nombres: true,
                dim_abogados_apellidos: true,
                dim_abogados_descripcion: true,

                // Fetch especialidades
                rel_especialidades_abogados: {
                    select: {
                        dim_especialidades_abogados: {
                            select: {
                                dim_especialidades_abogados_nombre: true,
                            },
                        },
                    },
                },

                // Fetch precios (servicios y precios)
                dim_servicios: {
                    select: {
                        dim_servicios_nombre: true,
                        dim_precios: {
                            select: {
                                dim_precios_neto: true,
                            },
                        },
                    },
                },

                // Fetch reviews (rating y opiniones)
                dim_review: {
                    select: {
                        dim_review_rating: true,
                        dim_review_text: true,
                    },
                },

                // Fetch imagen de perfil (avatar)
                dim_urls: {
                    select: {
                        dim_urls_url: true,
                    },
                },

            },
        });

        // Transformación para specialty, precios, opiniones y rating
        const abogadoResult = {
            idAbogado: abogadoData.idAbogado,
            licencia: abogadoData.dim_abogados_licencia,
            cedula: abogadoData.dim_abogados_cedula,
            nombres: abogadoData.dim_abogados_nombres,
            apellidos: abogadoData.dim_abogados_apellidos,
            specialty: abogadoData.rel_especialidades_abogados.map(e => e.dim_especialidades_abogados.dim_especialidades_abogados_nombre).join(', '),
            precios: abogadoData.dim_servicios.map(s => `${s.dim_servicios_nombre}##${s.dim_precios.dim_precios_neto}`).join('###') || 'Sin Servicio##0##0',
            avatar: abogadoData.dim_urls?.dim_urls_url || '',
            rating: abogadoData.dim_review.length > 0 ? abogadoData.dim_review[0].dim_review_rating : '0',
            opiniones: abogadoData.dim_review.map(r => `${r.dim_cliente_usuarios.dim_usuarios_usuario}||${r.dim_review_text}`).join('##'),
            descripcion: abogadoData.dim_abogados_descripcion || '',
            // experiencias: abogadoData.dim_experiencias.map(e => e.dim_experiencias_descripcion).join('||') || '',
            // favorito: abogadoData.dim_favoritos.length > 0 ? abogadoData.dim_favoritos[0].dim_favoritos_id : -1,
        };

        res.json({ lawyer: abogadoResult })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal"
        });
    }
}



module.exports = {
    getEspecialidades, 
    setLawyer,
    getLawyerSpecialties,
    getLawyersByFilter,
    createFavoriteLawyer,
    deleteFavoriteLawyer,
    getLawyerScheduleById,
    getLawyerById,
}
