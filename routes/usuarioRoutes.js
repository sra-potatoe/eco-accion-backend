const express = require('express');
const { body, validationResult } = require('express-validator');
const { crearUsuario, listarUsuarios } = require('../controllers/usuarioController');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
// Validaciones para la creación de usuario

const validarUsuario = [

  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El email no es válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono')
  .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos')
  .optional() 
  .matches(/^\d+$/).withMessage('El teléfono solo debe contener números')


];

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ mensaje: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};
//Uusarios ya no es /CrearUsuarios
router.post('/usuarios', validarUsuario, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, email, password, telefono } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya está registrado' });
    }

    // Crear el usuario con contraseña hasheada
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      telefono,
    });

    // Generar un token para el usuario recién creado
    const token = jwt.sign({ id: nuevoUsuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      mensaje: 'Usuario creado con éxito',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el usuario', error: error.message });
  }
});

router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId, {
      attributes: ['id', 'nombre', 'email', 'telefono'],
    });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil', error: error.message });
  }
});
// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      nombre: usuario.nombre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

// Ruta para obtener el perfil del usuario
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId, {
      attributes: ['id', 'nombre', 'email', 'telefono'],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  // Opcional: agrega el token a una lista negra
  res.status(200).json({ mensaje: 'Cierre de sesión exitoso' });
});


module.exports = router;
