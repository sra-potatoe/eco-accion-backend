const express = require('express');
const { crearProyecto, listarProyectos } = require('../controllers/proyectoController');
const verificarToken = require('../middleware/authMiddleware');
const router = express.Router();


router.put('/:id/confirmar-donacion', verificarToken, confirmarDonacion); 

router.post('/proyectos', verificarToken, crearProyecto);
router.get('/proyectos', listarProyectos);
router.post('/proyectos', proyectoController.crearProyecto);
router.get('/proyectos', proyectoController.obtenerProyectos);

module.exports = router;
