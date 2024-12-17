const { Router } = require('express');
const { getAllCourses,
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
     } = require('../../controllers/courses/productos');

const router = Router();

router.get("/courses", getAllCourses );
router.post("/courses", getOneCourse );
router.post("/cursoComprado", getCursoComprado);
router.post("/courses2", getComentario );

router.get("/coursesWOActive", getAllCoursesWihtActive );
router.post("/UpdateActiveCourse", setUpdateActiveCourseC );

router.get("/all/categorias", getCategoriesCourses );
router.post("/categorias", getCoursesPorCategorias );
router.post("/ContentXCourses", getCoursesContentJson );
router.post("/ContentXCoursesWithUser", getCoursesContentJsonWithUsur );
router.post("/setViewed", setViewedXUserAction );

router.post("/commentXCourses", getCommentXCourses );
router.post("/NewCommentXCourses", setCommentXCourses );
router.post("/NewCommentLikeXCoursesOrUpdate", setCommentXCoursesLike );

router.post("/ratingXUser", setRatingXUserR );

router.post("/CoursesNew", setCoursesNew );
router.post("/CoursesExam", getCoursesExamPreguntasC );
router.post("/CoursesExamAprobados", getAprobadosCursoUsuario );
router.post("/CoursesUpdateAprobados", updateCursoAprobado );

module.exports = router;