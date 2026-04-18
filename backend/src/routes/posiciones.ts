import { Router } from 'express';
import Posicion from '../models/Posicion';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const posiciones = await Posicion.find()
      .populate('id_torneo', 'nombre_torneo')
      .populate('id_equipo', 'nombre_equipo');
    res.json(posiciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener posiciones' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const posicion = await Posicion.findById(req.params.id)
      .populate('id_torneo', 'nombre_torneo')
      .populate('id_equipo', 'nombre_equipo');
    if (!posicion) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(posicion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nueva = new Posicion(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear posición', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizada = await Posicion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Posicion.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Posición eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar' });
  }
});

export default router;