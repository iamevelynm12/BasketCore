import { Router, Request, Response } from 'express';
import Partido from '../models/Partido';
import Equipo from '../models/Equipo';

const router = Router();

// GET /api/partidos/en-vivo
router.get('/en-vivo', async (req: Request, res: Response): Promise<any> => {
  try {
    const partido = await Partido.findOne({ estado: 'En progreso' })
      .populate('id_equipo1')
      .populate('id_equipo2');
    return res.json(partido);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener partido en vivo' });
  }
});

// POST /api/partidos
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const nuevo = new Partido(req.body);
    await nuevo.save();
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(400).json({ message: 'Error al crear partido' });
  }
});

// PUT /api/partidos/:id
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
  console.log('PUT recibido - body completo:', JSON.stringify(req.body));
  try {
    const partidoPrevio = await Partido.findById(req.params.id);
    if (!partidoPrevio) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    // Tomamos los puntos del body SI vienen, si no usamos los que ya están en BD
    const puntosLocal =
      req.body.puntos_equipo1 !== undefined
        ? Number(req.body.puntos_equipo1)
        : Number(partidoPrevio.puntos_equipo1);

    const puntosVisitante =
      req.body.puntos_equipo2 !== undefined
        ? Number(req.body.puntos_equipo2)
        : Number(partidoPrevio.puntos_equipo2);

    // Solo actualizamos equipos si el partido pasa a Terminado
    if (req.body.estado === 'Terminado' && partidoPrevio.estado !== 'Terminado') {
      const idLocal = partidoPrevio.id_equipo1;
      const idVisitante = partidoPrevio.id_equipo2;

      console.log(`Finalizando partido: Local ${puntosLocal} - Visitante ${puntosVisitante}`);

      if (puntosLocal > puntosVisitante) {
        await Equipo.findByIdAndUpdate(idLocal,     { $inc: { ganadas: 1 } });
        await Equipo.findByIdAndUpdate(idVisitante, { $inc: { derrotas: 1 } });
        console.log('Ganó Local');
      } else if (puntosVisitante > puntosLocal) {
        await Equipo.findByIdAndUpdate(idVisitante, { $inc: { ganadas: 1 } });
        await Equipo.findByIdAndUpdate(idLocal,     { $inc: { derrotas: 1 } });
        console.log('Ganó Visitante');
      }
    }

    const actualizado = await Partido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar partido:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
});

export default router;