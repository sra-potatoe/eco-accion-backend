const Donacion = require('../models/donacion');
const Proyecto = require('./models/Proyecto');

const registrarDonacion = async (req, res) => {
  try {
    const { monto, proyectoId } = req.body;
    const usuarioId = req.usuarioId;

    const proyecto = await Proyecto.findByPk(proyectoId);
    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }

    // Registrar donación
    const donacion = await Donacion.create({
      monto,
      usuarioId,
      proyectoId,
    });

    // Actualizar el monto de donaciones recibidas
    proyecto.donacionesRecibidas += monto;
    await proyecto.save();

    res.status(201).json({ mensaje: 'Donación registrada con éxito', donacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar la donación', error: error.message });
  }
};

module.exports = { registrarDonacion };
