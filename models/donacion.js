const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Proyecto = require('./proyecto'); // Asegúrate de que la ruta sea correcta


const Donacion = sequelize.define('Donacion', {
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  confirmado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

Donacion.belongsTo(Usuario, { as: 'donante', foreignKey: 'donanteId' });
Donacion.belongsTo(Proyecto, { as: 'proyecto', foreignKey: 'proyectoId' });

module.exports = Donacion;
