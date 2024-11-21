require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const sequelize = require('./config/database'); // Ajusta según tu configuración
const usuarioRoutes = require('./routes/usuarioRoutes');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const proyectoRoutes = require('./routes/proyectoRoutes');
const donacionRoutes = require('./routes/donacionRoutes');

const app = express();
app.use(express.json());


app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type'], 
}));
app.use('/api', usuarioRoutes);
//app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/donaciones', donacionRoutes);

// Configuración de límite de solicitudes
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Demasiadas solicitudes, intenta de nuevo más tarde.',
});
app.use(limitador);

// Conexión a la base de datos
sequelize.sync({ force: false })
  .then(() => console.log('Conexión a la base de datos establecida con éxito.'))
  .catch((error) => console.error('No se pudo conectar a la base de datos:', error));

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ mensaje: 'Ocurrió un error en el servidor' }); 
});

// Puerto de servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
