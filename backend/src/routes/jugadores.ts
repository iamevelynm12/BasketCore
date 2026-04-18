import { Router } from 'express';
import Jugador from '../models/Jugador';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const jugadores = await Jugador.find().populate('id_equipo', 'nombre_equipo');
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener jugadores' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id).populate('id_equipo');
    if (!jugador) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(jugador);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevo = new Jugador(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear jugador', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Jugador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Jugador.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Jugador eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar' });
  }
});

export default router;