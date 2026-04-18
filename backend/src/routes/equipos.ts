import { Router } from 'express';
import Equipo from '../models/Equipo';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const equipos = await Equipo.find();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener equipos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.id);
    if (!equipo) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevo = new Equipo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear equipo', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Equipo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Equipo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Equipo eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar' });
  }
});

export default router;