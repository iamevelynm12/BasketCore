import { Router, Request, Response } from 'express'; // <-- CORREGIDO: Importamos Request y Response
import Equipo from '../models/Equipo';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5mb máximo
});

// Función para subir imagen a Cloudinary
const uploadImage = async (file: Express.Multer.File) => {
  const base64Image = Buffer.from(file.buffer).toString('base64');
  const dataUri = `data:${file.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.uploader.upload(dataUri);
  return uploadResponse.url;
};



// Ruta exacta para obtener la tabla de posiciones real basada en ganadas y derrotas
router.get('/tabla/rendimiento', async (req: Request, res: Response): Promise<any> => {
  try {
    // Busca todos los equipos y los ordena por más ganadas y menos derrotas
    const listaOrdenada = await Equipo.find().sort({ ganadas: -1, derrotas: 1 });
    return res.json(listaOrdenada);
  } catch (error) {
    console.error("Error al generar tabla:", error);
    return res.status(500).json({ mensaje: "Error interno al generar la tabla" });
  }
});

// Obtener todos los equipos
router.get('/', async (req: Request, res: Response) => {
  try {
    const equipos = await Equipo.find();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener equipos' });
  }
});



// Obtener un equipo por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const equipo = await Equipo.findById(req.params.id);
    if (!equipo) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

// Crear equipo con imagen
router.post('/', upload.single('imageFile'), async (req: Request, res: Response) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }
    const nuevo = new Equipo({ ...req.body, imageUrl });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear equipo', error });
  }
});

// Actualizar equipo con imagen
router.put('/:id', upload.single('imageFile'), async (req: Request, res: Response) => {
  try {
    const equipo = await Equipo.findById(req.params.id);
    if (!equipo) return res.status(404).json({ mensaje: 'No encontrado' });

    equipo.nombre_equipo = req.body.nombre_equipo;
    equipo.abreviatura = req.body.abreviatura;
    equipo.categoria = req.body.categoria;
    equipo.entrenador = req.body.entrenador;
    equipo.carrera = req.body.carrera;

    if (req.file) {
      equipo.imageUrl = await uploadImage(req.file);
    }

    await equipo.save();
    res.json(equipo);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar' });
  }
});

// Eliminar equipo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Equipo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Equipo eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar' });
  }
});

export default router;