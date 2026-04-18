import { Router } from 'express';
import Arbitro from '../models/Arbitro';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const arbitros = await Arbitro.find();
    res.json(arbitros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener árbitros' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const arbitro = await Arbitro.findById(req.params.id);
    if (!arbitro) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(arbitro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevo = new Arbitro(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear árbitro', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Arbitro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Arbitro.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Árbitro eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar' });
  }
});

export default router;