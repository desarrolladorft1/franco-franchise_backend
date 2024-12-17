const { response } = require("express")
var FormData = require('form-data');
var fs = require('fs');
var path = require('path')
let reqPath = path.join(__dirname, '../../')
var dir = reqPath + '/uploads/';

var { dbConnecttion } = require("../../db/config");
const { getAllCoursesSQL, 
        getAllCoursesWithActiveSQL,
        setUpdateActiveCourse,
        getCoursesPorCategoriasSQL,
        getCategoriesCoursesSQL,
        getCoursesContentHeaderSQL,
        getCoursesContentHeaderWithUserSQL,
        setViewedXUser,
        getCommentXCoursesSQL,
        setCommentXCoursesSQL,
        setCommentXCoursesSonSQL,
        setCommentXCoursesRel_UserSQL,
        setCommentXCoursesRel_ProductSQL,
        setCommentXCoursesLikeSQL,
        getCommentXCoursesLikeSQL,
        updateCommentXCoursesLikeSQL,

        updateCommentXAdd,
        updateCommentXRemove,

        setRatingXUser,

        setCoursesProductNew,
        setCoursesPrecioNew,
        setCoursesRelPrecioNew,
        setCoursesRelCategorioNew,
        setCoursesProductos_cursosNew,
        setCoursesRelProductos_cursosNew,
        setCoursesUrlPrevieAndImgwNew,
        setCoursesRelUrlPreviewNew,
        setCoursesRelProductoTypeNew,
        setCoursesContenNew,
        setCoursesContenDetailNew,
        setCoursesRelContenDetailNew,
        setCoursesRelContenDetailCoursesNew,
        setCoursesRelURLContenDetailCoursesNew,

        setCoursesExam,
        setCoursesExam_preguntas,
        setCoursesExam_opciones,
        setCoursesRelExam_courses,
        setCoursesRelExam_preguntas,
        setCoursesRelPreguntas_opciones,
        getCoursesExamPreguntas,
        getAprobadosPorCursoYUsuario,
        updateAprobado,
        getOneCourseSQL,
        getCursoCompradoSQL,
        getComentarioSQL
          
    } = require("../../SQL/courses/productos");

const getAllCourses =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        // let dataFinal = [];
        // let index = 0;
        connet.query(getAllCoursesSQL, 
        function (err, rows, fields) {
            if (rows != undefined && rows != null) {
                rows.forEach(producto => {
                    producto.categorias = producto.categorias.split(',')
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
                 
                  
                    // producto.requirements = producto.requirements.split('*--*')
                    // producto.includes = producto.includes.split('*--*')
                    // producto.course_for = producto.course_for.split('*--*')

                    // dataFinal.push({
                    //   "idProducto":producto.idProducto,
                    //   "idCategorias":producto.idCategorias,
                    //   "nombre":producto.nombre,
                    //   "descripcion":producto.descripcion,
                    //   "dueno":producto.dueno,
                    //   "job":producto.job,
                    //   "avatar":producto.avatar,
                    //   "categorias":producto.categorias,
                    //   "categoriasString":producto.categoriasString,
                    //   "neto":producto.neto,
                    //   "rating":producto.rating,
                    //   "learn":[],
                    //   "requirements":[],
                    //   "includes":[],
                    //   "course_for":[]
                    // })

                    // for(let learn of producto.learn.split("*--*")){
                    //     dataFinal[index].learn.push({
                    //         "list":learn
                    //     })
                    // }

                    // for(let requirements of producto.requirements.split("*--*")){
                    //     dataFinal[index].requirements.push({
                    //         "list":requirements
                    //     })
                    // }

                    // for(let includes of producto.includes.split("*--*")){
                    //     dataFinal[index].includes.push({
                    //         "list":includes
                    //     })
                    // }

                    // for(let course_for of producto.course_for.split("*--*")){
                    //     dataFinal[index].course_for.push({
                    //         "list":course_for
                    //     })
                    // }

                    // index++;
                })
            }
           
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


const getOneCourse =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
      
        connet.query(getOneCourseSQL, [ id ], 
        function (err, rows, fields) {
            if (rows != undefined && rows != null) {
                rows.forEach(producto => {
                    producto.categorias = producto.categorias.split(',')
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
            }
           
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


const getCursoComprado =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { idCliente , idProducto } = req.body;
        // console.log(req.body);
        connet.query(getCursoCompradoSQL, [ idCliente, idProducto ],
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

const getComentario =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
      
        connet.query(getComentarioSQL, [ id ], 
        function (err, rows, fields) {
            if (rows != undefined && rows != null) {
                rows.forEach(producto => {
                    producto.categorias = producto.categorias.split(',')
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
            }
           
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

const getAllCoursesWihtActive =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        // let dataFinal = [];
        // let index = 0;
        connet.query(getAllCoursesWithActiveSQL, 
        function (err, rows, fields) {
            if (rows != undefined && rows != null) {
                rows.forEach(producto => {
                    producto.categorias = producto.categorias.split(',')
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
            }
           
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

const setUpdateActiveCourseC =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        console.log(req.body);
        const { activo, dim_productos_id } = req.body;

        connet.query(setUpdateActiveCourse, [activo,
                                            dim_productos_id ],
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


const getCoursesPorCategorias =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        let sql = getCoursesPorCategoriasSQL;
        let array = [];
        let  Stringid = null;
        let min= null;
        let max= null;

        const { id, rating, prices } = req.body;

        if (id.length == 0 && rating == null && prices == null ) {
            sql = getAllCoursesSQL
        }else{
            if (id.length > 0) {
                Stringid = String(id);
            }
        }

        if (prices != null && prices != undefined) {
            min = prices.min
            max = prices.max
        }

        connet.query(sql, [ Stringid, 
                            rating,
                            min,
                            max ],
        function (err, rows, fields) {
            if (err) throw err
            if (Array.isArray(rows) && rows != null && rows != undefined && rows.length > 0) {
       
                if (rows[1].insertId == undefined ) {
                    array = rows
                }else{
                    array = rows[0]
                }
                array.forEach(producto => {
                    producto.categorias = producto.categorias.split(',')
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
            }
            return res.status(200).json( {
                ok:true,
                data: array
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

const getCategoriesCourses =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        connet.query(getCategoriesCoursesSQL, 
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

const getCoursesContentJson =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { id } = req.body;
        let poiter = null;
        let Index = null;
        let finalData = []

        connet.query(getCoursesContentHeaderSQL, [ id ], async function (err, rows, fields) {
                if (err) throw err
                rows.forEach(item => {
            
                    if (poiter != null && poiter == item.idProductoContent) {
                        finalData[Index].content.push({
                            "name_detail":item.name_detail,
                            "total_tiempo_detail":item.total_tiempo_detail,
                            "urli":item.urli
                        })
                    }else{
                        finalData.push({
                            "nombre":item.nombre,
                            "total_clases":item.total_clases,
                            "total_tiempo":item.total_tiempo,
                            "content": [{
                                "name_detail":item.name_detail,
                                "total_tiempo_detail":item.total_tiempo_detail,
                                "urli":item.urli,
                                "task": false
                            }]
                        })
                        if (Index == null) {
                            Index = 0
                        }else{
                            Index++;
                        }
                    }
                    poiter = item.idProductoContent
                });
                return res.status(200).json( {
                    ok:true,
                    data: finalData
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

const getCoursesContentJsonWithUsur =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { idproducto, idUsuario } = req.body;
        let poiter = null;
        let Index = null;
        let finalData = []

        connet.query(getCoursesContentHeaderWithUserSQL, [  idproducto, 
                                                            idUsuario ],
        async function (err, rows, fields) {
                if (err) throw err
                rows.forEach(item => {
            
                    if (poiter != null && poiter == item.idProductoContent) {
                        finalData[Index].content.push({
                            "name_detail":item.name_detail,
                            "total_tiempo_detail":item.total_tiempo_detail,
                            "urli":item.urli,
                            "viewed": item.viewed,
                            "courses_minute": item.courses_minute,
                            "User_id": item.User_id,
                            "id_detail": item.id_detail,
                        })
                    }else{
                        finalData.push({
                            "nombre":item.nombre,
                            "total_clases":item.total_clases,
                            "total_tiempo":item.total_tiempo,
                            "content": [{
                                "name_detail":item.name_detail,
                                "total_tiempo_detail":item.total_tiempo_detail,
                                "urli":item.urli,
                                "viewed": item.viewed,
                                "courses_minute": item.courses_minute,
                                "User_id": item.User_id,
                                "id_detail": item.id_detail,
                            }]
                        })
                        if (Index == null) {
                            Index = 0
                        }else{
                            Index++;
                        }
                    }
                    poiter = item.idProductoContent
                });
                return res.status(200).json( {
                    ok:true,
                    data: finalData
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

const setViewedXUserAction =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { detaill_id, dim_usuarios_id, viewedStatus } = req.body;

        connet.query(setViewedXUser, [  viewedStatus, 
                                        detaill_id,
                                        dim_usuarios_id ],
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

function list_to_tree (list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
        map[list[i].NodeID] = i; // initialize the map
        list[i].children = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.ParentNodeID !== null) {
            // if you have dangling branches check that map[node.ParentNodeID] exists
            list[map[node.ParentNodeID]].children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
}

const getCommentXCourses =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        const { idProducto, idUsuario } = req.body;
        let ArrayTree = [];
        connet.query(getCommentXCoursesSQL, [idUsuario, idProducto], function (err, rows, fields) {
            if (err) throw err

            rows.forEach(element => {
                ArrayTree.push({
                        "NodeID": element.ID,
                        "ParentNodeID": element.dim_padre,
                        "header": element.header,
                        "clike": element.clike,
                        "nro_like": element.nro_like,
                        "idCliente": element.idCliente,
                        "dim_usuarios_usuario": element.dim_usuarios_usuario,
                        "dim_comment": element.dim_comment,
                        "idProducto": element.idProducto,
                        "nameProducto": element.nameProducto,
                        "nombres": element.nombres,
                        "apellidos": element.apellidos,
                        "fechacreacion": element.fechacreacion,
                        "email": element.email,
                        "showMore": false,
                        "showAnswer": false,
                        "children": null
                })    
            });

            return res.status(200).json({
                ok:true,
                data: list_to_tree(ArrayTree)
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

const setCommentXCourses =  async (req, res = response ) =>{
    let connet = await dbConnecttion();

    try {
        let Sql ;
        let passData ;
        const { dim_padre_id ,header,dim_comment,idUsuario,idProducto } = req.body.data;

        if (dim_padre_id == null || dim_padre_id == undefined) {
            Sql = setCommentXCoursesSQL
            passData = [header,dim_comment]
        }else{
            Sql = setCommentXCoursesSonSQL
            passData = [dim_padre_id,dim_comment]
        }

        new Promise((resolve, reject) => {
            connet.query(Sql, passData,
                function (err, rows, fields) {
                    if (err) throw err
                    resolve(rows);
                })
        }).then(value => {
            if (value) {
    
                connet.query(setCommentXCoursesRel_UserSQL, [value.insertId,idUsuario])
    
                connet.query(setCommentXCoursesRel_ProductSQL, [value.insertId,idProducto])
                
                connet.end();
                return res.status(200).json({
                    ok:true,
                    data: value
                });
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

const setCommentXCoursesLike =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        // console.log(req.body);
        const { idUsuario, idComment, like } = req.body.data;
        
        connet.query(getCommentXCoursesLikeSQL, [  idComment,idUsuario ],
        function (err, rows, fields) {
            if (err) throw err
            // console.log(rows);
            if (rows.length == 0) {
                connet.query(setCommentXCoursesLikeSQL, [idComment,idUsuario,like])
            }else{
                connet.query(updateCommentXCoursesLikeSQL, [like,idComment,idUsuario])
            }

            if (like == true) {
                connet.query(updateCommentXAdd, [idComment])
            }else{
                connet.query(updateCommentXRemove, [idComment])
            }

            connet.end();
            return res.status(200).json({
                ok:true,
                data: rows
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

const setRatingXUserR =  async (req, res = response ) =>{
    try {
        // console.log(req.body);
        let connet = await dbConnecttion();
        const { dim_productos_id, 
                dim_usuarios_id, 
                rel_productos_cursos_rating,
                rel_productos_cursos_rating_comment} = req.body.data;

        connet.query(setRatingXUser, [  dim_productos_id, 
                                        dim_usuarios_id,
                                        rel_productos_cursos_rating,
                                        rel_productos_cursos_rating_comment],
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

const setCoursesNew =  async (req, res = response ) =>{
    let connet;
    try {
        let sampleFile;
        connet = await dbConnecttion();
        connet.beginTransaction();
        console.log(req.files);
        // console.log(req.body);
        let dataForm = JSON.parse(req.body.document)
        // console.log(req.body.document);

        const { step1, 
                step2, 
                step3,
                step4,
                step5 } = dataForm[0] ;

        // console.log(step1);
        // console.log(step2);
        // console.log(step3);
        // console.log(step4);
        // console.log(step5.exam.Examen);


       let newXXX =  await new Promise((resolve, reject) => {
            connet.query(setCoursesProductNew, [step1.coursesName, step1.coursesDesc],
                function (err, rows, fields) {
                    if (err) throw err
                    // console.log(rows);
                    resolve(rows.insertId)
            });
        }).then( async (coursesId) => {
            console.log(coursesId);
            if (coursesId) {
                // try {

                    let dirGlobal = dir + step1.coursesName
                    if (!fs.existsSync(dirGlobal)){
                        fs.mkdirSync(dirGlobal, { recursive: true });
                    }
    
                    console.log("Tipo");
                    connet.query(setCoursesRelProductoTypeNew, [coursesId, 3 ])
    
                    return await new Promise( async (resolve, reject) => {
                        console.log("Precio");
                        let precio =  await new Promise((resolve, reject) => {
                            connet.query(setCoursesPrecioNew, [step1.coursesPrices, '1', step1.coursesPrices, 0],
                                function (err, rows, fields) {
                                    if (err) throw err
                                    resolve(rows.insertId)
                            });
                        }).then( async (precioId) => {
                            return await new Promise(async (resolve, reject) => {
                                connet.query(setCoursesRelPrecioNew, [coursesId,precioId],
                                    function (err, rows, fields) {
                                        if (err) throw err
                                        resolve(true);
                                });
                            })
                           
                        })
                        // console.log("precio",precio);
        
                        console.log("Categoria");
                        for  await (const category of step1.coursesCategori) {
                            connet.query(setCoursesRelCategorioNew, [coursesId,category.idCategoria],
                                function (err, rows, fields) {
                                    if (err) throw err
                            });
                        }
        
                        console.log("Detalles de la categoria");
                        let details = await new Promise(async (resolve, reject) => {
                            let IndexQ= 1;
                            let IndexL= 1;
                            let IndexR= 1;
                            let IndexI= 1;
                            let descDatos = { 
                                "quienEsArray":"",
                                "loQueAprenArray":"",
                                "requisitosArray":"",
                                "esteIncluyeArray":""
                            }
        
                            for  await (const quienEsArray of step2.quienEsArray) {
                                if (IndexQ < step2.quienEsArray.length ) {
                                    descDatos.quienEsArray  = descDatos.quienEsArray + quienEsArray + "*--*"
                                }else{
                                    descDatos.quienEsArray = descDatos.quienEsArray + quienEsArray
                                }
                                IndexQ++;
                            }
        
                            for  await (const loQueAprenArray of step2.loQueAprenArray) {
                                if (IndexL < step2.loQueAprenArray.length ) {
                                    descDatos.loQueAprenArray  = descDatos.loQueAprenArray + loQueAprenArray + "*--*"
                                }else{
                                    descDatos.loQueAprenArray = descDatos.loQueAprenArray + loQueAprenArray
                                }
                                IndexL++;
                            }
        
                            for  await (const requisitosArray of step2.requisitosArray) {
                               
                                if (IndexR < step2.requisitosArray.length ) {
                                    descDatos.requisitosArray  = descDatos.requisitosArray + requisitosArray + "*--*"
                                }else{
                                    descDatos.requisitosArray = descDatos.requisitosArray + requisitosArray
                                }
                                IndexR++;
                            }
    
                            for  await (const esteIncluyeArray of step2.esteIncluyeArray) {
                               
                                if (IndexI < step2.esteIncluyeArray.length ) {
                                    descDatos.esteIncluyeArray  = descDatos.esteIncluyeArray + esteIncluyeArray + "*--*"
                                }else{
                                    descDatos.esteIncluyeArray = descDatos.esteIncluyeArray + esteIncluyeArray
                                }
                                IndexI++;
                            }
                            resolve(descDatos);
                        }).then( async (descDatos) => {

                            return await new Promise(async (resolve, reject) => {
                                connet.query(setCoursesProductos_cursosNew, [descDatos.loQueAprenArray, 
                                                                            descDatos.requisitosArray, 
                                                                            descDatos.quienEsArray,
                                                                            descDatos.esteIncluyeArray],
                                    function (err, rows, fields) {
                                    if (err) throw err

                                    connet.query(setCoursesRelProductos_cursosNew, [coursesId, rows.insertId ])

                                    console.log(rows.insertId);

                                    resolve (rows.insertId)
                                    });
                            
                            })
                          
                        })
                        // console.log("details",details);
        
                        console.log("Preview");
                        let Preview =  await new Promise((resolve, reject) => {
                            sampleFile = req.files["files[]"];
                            uploadPath = dir + step1.coursesName + "/Preview/" +sampleFile[0].name + ".mp4";
                            uploadPathWOdir = /uploads/  + step1.coursesName + "/Preview/" +sampleFile[0].name + ".mp4";
                            console.log(uploadPath);
                            fs.mkdirSync(dir + step1.coursesName +"/Preview/", { recursive: true });
                            sampleFile[0].mv(uploadPath)
                            resolve( uploadPathWOdir )
                        }).then( async (previewDir) => {

                            return await new Promise(async (resolve, reject) => {
                                connet.query(setCoursesUrlPrevieAndImgwNew, [previewDir, 6 ], function (err, rows, fields) {
                                    if (err) throw err
                                    connet.query(setCoursesRelUrlPreviewNew, [rows.insertId, coursesId ])
                                    resolve(true) ;
                                } )
                            })

                          
                        })
                        // console.log("Preview",Preview);
        
                        console.log("Img");
                        let Img =  await new Promise((resolve, reject) => {
                            sampleFile = req.files["files[]"];
                            uploadPath = dir + step1.coursesName + "/Img/" +sampleFile[1].name + ".png"; 
                            uploadPathWOdir = /uploads/  + step1.coursesName + "/Img/" +sampleFile[1].name + ".png"; 
                            console.log(uploadPath);
                            fs.mkdirSync(dir + step1.coursesName + "/Img/", { recursive: true });
                            sampleFile[1].mv(uploadPath)
                            resolve(uploadPathWOdir)
                        }).then( async (imgDir) => {
                            return await new Promise(async (resolve, reject) => {
                                connet.query(setCoursesUrlPrevieAndImgwNew, [imgDir, 1 ], function (err, rows, fields) {
                                    if (err) throw err
                                    connet.query(setCoursesRelUrlPreviewNew, [rows.insertId, coursesId ])
                                    resolve(true);
                                } )
                            })
                          
                        })
                        // console.log("Img",Img);
        
                        console.log("Examen");
                        let Examen =  await new Promise((resolve, reject) => {
                            sampleFile = req.files["files[]"];
                            uploadPath = dir + step1.coursesName + "/Examen/" +sampleFile[2].name + ".xlsx";
                            console.log(uploadPath);
                            uploadPathWOdir = /uploads/ + step1.coursesName + "/Examen/" +sampleFile[2].name + ".xlsx";
                            fs.mkdirSync(dir + step1.coursesName + "/Examen/", { recursive: true });
                            sampleFile[2].mv(uploadPath)
                            resolve(uploadPathWOdir)
                        }).then( async (imgDir) => {
                            // connet.query(setCoursesUrlPrevieAndImgwNew, [imgDir, 1 ], function (err, rows, fields) {
                            //     if (err) throw err
                            //     connet.query(setCoursesRelUrlPreviewNew, [rows.InsertId, coursesId ])
                                return true;
                            // } )
                        })
                        // console.log("Examen",Examen);
    
                        console.log("Contenido del curso");
                        let Contenido =  await new Promise( async (resolve, reject) => {
                            for await (const elementFather of step4) {

                               let aqui = await new Promise( async (resolve, reject) => {
                                    connet.query(setCoursesContenNew, [ elementFather.data.name, elementFather.children.length, 5000  ], async function  (err, rows, fields) {
                                        if (err) throw err

                                        for (const elementSon of elementFather.children) {
                                     

                                            let son = await new Promise( async (resolve, reject) => {
                                                connet.query(setCoursesContenDetailNew, [ elementSon.data.name, 3000 ], async function (err, rowsSon, fields) {
                                                    if (err) throw err
    
                                                    let conteCourses =  await new Promise( async (resolve, reject) => {
                                                        connet.query(setCoursesRelContenDetailNew, [ rowsSon.insertId,rows.insertId ])
    
                                                        sampleFile = req.files["files[]"];
        
                                                        const foundVideo = sampleFile.find(element => element.name == elementSon.data.name);
                                                
                                                        if (foundVideo) {
        
                                                            let newVideoCursos =  await new Promise( async (resolve, reject) => {
                                                                let dirVideo = dir + step1.coursesName + "/VideoCursos"
                                                                if (!fs.existsSync(dirVideo)){
                                                                    fs.mkdirSync(dirVideo, { recursive: true });
                                                                }
                                                                uploadPathVideoSon =  dir + step1.coursesName + "/VideoCursos/" + elementSon.data.name + ".mp4";
                                                                uploadPathDB = /uploads/ + step1.coursesName + "/VideoCursos/" + elementSon.data.name + ".mp4";
                                                                foundVideo.mv(uploadPathVideoSon)
                                                                resolve(uploadPathDB)
                                                            }).then( async (videoDir) => {

                                                               return await new Promise( async (resolve, reject) => {

                                                                    connet.query(setCoursesUrlPrevieAndImgwNew, [videoDir, 2 ], function (err, rowsUrl, fields) {
                                                                        if (err) throw err
                                                                        connet.query(setCoursesRelURLContenDetailCoursesNew, [rowsSon.insertId, rowsUrl.insertId ])
                                                                        resolve(true) ;
                                                                    } )

                                                                })

                                                               
                                                            })
                                                            resolve(true)
                                                        }   
                                                    })

                                                    resolve(true);
                                                });
                                            })

                                            resolve(true);

                                       
                                        }
                                        connet.query(setCoursesRelContenDetailCoursesNew, [ coursesId,rows.insertId ])
                                        resolve(true);
                                    });

                                }).then( value =>{
                                    if (value) {
                                        return(value);  
                                    }
                                })
                            }
                            resolve(true)
                        }).then( value =>{
                            if (value) {
                                return(value);  
                            }
                        })
                        // console.log("Contenido",Contenido);
    
                        
                        console.log("Examenes");
                        let Exam = await new Promise(async (resolve, reject) => {
                            connet.query(setCoursesExam, [step1.coursesName, 'Mixto'],
                                function (err, rows, fields) {
                                    if (err) throw err
                                    resolve(rows.insertId)
                            });
                        }).then( async (examenId) => {
                            if (examenId) {
                                connet.query(setCoursesRelExam_courses, [coursesId, examenId])
                                let arrayOpciones = [];
                                let respuestaCorrecta = false;
    
                                // console.log(step5);
                                // console.log(step5.exam);
                                // console.log(step5.exam.Examen);
    
                                let pex = await new Promise(async (resolve, reject) => {
    
                                    for  await (const exam of  step5.exam.Examen) {
                                    
                                        await new Promise(async (resolve, reject) => {

                                            connet.query(setCoursesExam_preguntas, [exam.Preguntas, exam.Tipo], async function (err, rowsPreguntas, fields) {
                                                if (err) throw err
            
                                                    connet.query(setCoursesRelExam_preguntas, [examenId, rowsPreguntas.insertId])
            
            
                                                    if (exam.Tipo == 'Selección' ) {
                                                        arrayOpciones.push(exam['Opcion 1'])
                                                        arrayOpciones.push(exam['Opcion 2'])
                                                        arrayOpciones.push(exam['Opcion 3'])
                                                        arrayOpciones.push(exam['Opcion 4'])
                                                        arrayOpciones.push(exam['Opcion 5'])
                                                    }else{
                                                        arrayOpciones.push(exam['Opcion 1'])
                                                        arrayOpciones.push(exam['Opcion 2'])
                                                    }
            
                                                    for  await (const opciones of  arrayOpciones) {
                                                        
                                                        if (opciones == exam['Respuesta Correcta']) {
                                                            respuestaCorrecta = true;
                                                        }else{
                                                            respuestaCorrecta= false
                                                        }

                                                        await new Promise(async (resolve, reject) => {
                                                            connet.query(setCoursesExam_opciones, [opciones, respuestaCorrecta],  async function (err, rowsOpciones, fields) {
                                                                if (err) throw err
                                                                connet.query(setCoursesRelPreguntas_opciones, [rowsPreguntas.insertId, rowsOpciones.insertId])
                                                                resolve(true)
                                                            })
                                                        })
                                                        
                                                       
            
                                                    }
                                                    arrayOpciones = [];
                                                    resolve(true)
                                                })

                                        })
    
                                    }
                                     resolve(true);
                                }).then( async (examenId) => {
                                    return true ;
                                })
                                return pex;
                            }
                        })

                      
                        resolve(true); 
                       
                    }).then( value =>{
                        if (value) {
                            return(value);  
                        }
                    })


                // } catch (error) {
                //     console.log(error);
                // } 
            }
        })

        console.log("Final");
        // console.log(connet);
        connet.commit();
        connet.end();
        return res.status(200).json({
            ok:true,
            data: newXXX
        });

    } catch (error) {
        console.log("TryErrorr",error);
        connet.rollback();
        connet.end();
        return  res.status(500).json( {
            ok:false,
            msg:"Algo salio mal"
        });
    }
}

const getCoursesExamPreguntasC =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        console.log(req.body);
        const { coursesId } = req.body;
        
        connet.query(getCoursesExamPreguntas, [coursesId], async function (err, rows, fields) {
            if (err) throw err
            let indexS=0;              
            let newArray = [];             
            let preguntaAhora = ""
            for  await (const preguntas of  rows) {
                if (indexS == 0) {
                    preguntaAhora = preguntas.dim_preguntas_exam_pregunta
                    newArray.push({
                        question: preguntas.dim_preguntas_exam_pregunta,
                        answer:[{
                            option: preguntas.dim_opciones_exam_valor,
                            correct: preguntas.dim_preguntas_exam_correct
                        }]
                    })
                }else{
                    if (preguntaAhora == preguntas.dim_preguntas_exam_pregunta ) {
                        const index = newArray.findIndex(valor => valor.question === preguntaAhora);
                        newArray[index].answer.push({
                            option: preguntas.dim_opciones_exam_valor,
                            correct: preguntas.dim_preguntas_exam_correct
                        })
                    }else{
                        preguntaAhora = preguntas.dim_preguntas_exam_pregunta
                        newArray.push({
                            question: preguntas.dim_preguntas_exam_pregunta,
                            answer:[{
                                option: preguntas.dim_opciones_exam_valor,
                                correct: preguntas.dim_preguntas_exam_correct
                            }]
                        })
                    }
                }

                indexS++;
            }

            return res.status(200).json({
                ok:true,
                data: newArray
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

const getAprobadosCursoUsuario =  async (req, res = response ) =>{
    try {
        // console.log(req.body);
        let connet = await dbConnecttion();
        const { dim_exam_id, 
                dim_usuarios_id} = req.body;
        console.log(req.body);
        connet.query(getAprobadosPorCursoYUsuario, [  dim_exam_id,                             dim_usuarios_id],
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

const updateCursoAprobado =  async (req, res = response ) =>{
    try {
        let connet = await dbConnecttion();
        console.log(req.body);
        const { dim_aprobados,
                dim_exam_id, 
                dim_usuarios_id} = req.body;
        
        connet.query(updateAprobado, [  dim_aprobados,
                                        dim_exam_id, 
                                        dim_usuarios_id
            ],
        function (err, rows, fields) {
            if (err) throw err
            // console.log(rows);

            connet.end();
            return res.status(200).json({
                ok:true,
                data: rows
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

module.exports = {
    getAllCourses,
    getAllCoursesWihtActive,
    setUpdateActiveCourseC,
    getCoursesPorCategorias,
    getCategoriesCourses,
    getCoursesContentJson,
    getCoursesContentJsonWithUsur,
    setViewedXUserAction,
    getCommentXCourses,
    setCommentXCourses,
    setCommentXCoursesLike,
    setRatingXUserR,
    setCoursesNew,
    getCoursesExamPreguntasC,
    getAprobadosCursoUsuario,
    updateCursoAprobado,
    getOneCourse,
    getCursoComprado,
    getComentario
}
    