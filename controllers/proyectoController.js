const Proyecto = require('../models/proyecto');
//const Donacion = require('../models/donacion');

const crearProyecto = async (req, res) => {
    try {
      const { titulo, descripcion, extension, meta, montoRecaudado, estado, creadorId } = req.body;
      const nuevoProyecto = await Proyecto.create({
        titulo,
        descripcion,
        extension,
        meta,
        montoRecaudado,
        estado,
        creadorId
      });
      res.status(201).json(nuevoProyecto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el proyecto.' });
    }
  };
  const obtenerProyectos = async (req, res) => {
    try {
      const proyectos = await Proyecto.findAll();
      res.status(200).json(proyectos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los proyectos.' });
    }
  };

exports.listarProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.findAll({ include: 'creador' });
    res.status(200).json(proyectos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar proyectos', error: error.message });
  }
};
exports.confirmarDonacion = async (req, res) => {
    const { id } = req.params;
    try {
      const donacion = await Donacion.findByPk(id);
      if (!donacion) {
        return res.status(404).json({ mensaje: 'Donación no encontrada' });
      }
      donacion.confirmado = true;
      await donacion.save();
  
      const proyecto = await Proyecto.findByPk(donacion.proyectoId);
      proyecto.montoRecaudado += donacion.monto;
  
      if (proyecto.montoRecaudado >= proyecto.meta) {
        proyecto.estado = 'completado';
      }
  
      await proyecto.save();
      res.status(200).json({ mensaje: 'Donación confirmada', proyecto });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al confirmar la donación', error: error.message });
    }
  };
  
