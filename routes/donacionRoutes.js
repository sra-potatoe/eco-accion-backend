const express = require('express');
const { registrarDonacion } = require('../controllers/donacionController');
const verificarToken = require('../middleware/verificarToken');
const router = express.Router();

router.post('/', verificarToken, registrarDonacion);

module.exports = router;
    