const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const Proyecto = require('./models/proyecto');

sequelize.sync({ force: true })  
  .then(() => {
    console.log('Tablas creadas correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  });
  const usuarioRoutes = require('./routes/usuarioRoutes');
  app.use('/api/usuarios', usuarioRoutes);
  