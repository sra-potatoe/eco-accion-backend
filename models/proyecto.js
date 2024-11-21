const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Proyecto = sequelize.define('Proyecto', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  extension: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  meta: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  montoRecaudado: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'completado'),
    defaultValue: 'pendiente',
  },
}, {
  timestamps: true,
});

Proyecto.belongsTo(Usuario, { as: 'creador', foreignKey: 'creadorId' });

module.exports = Proyecto;
