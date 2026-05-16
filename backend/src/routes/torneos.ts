import { Router } from 'express';
import Torneo from '../models/Torneo';

const router = Router();



// Obtener todos
router.get('/', async (req, res) => {
  try {
    const torneos = await Torneo.find();
    res.json(torneos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener torneos' });
  }
});

// Obtener uno
router.get('/:id', async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(torneo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

// Crear
router.post('/', async (req, res) => {
  try {
    const nuevo = new Torneo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear torneo', error });
  }
});

// Actualizar
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Torneo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar' });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await Torneo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Torneo eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar' });
  }
});

export default router;