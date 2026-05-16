import { Router } from 'express';
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

// Obtener todos
router.get('/', async (req, res) => {
  try {
    const equipos = await Equipo.find();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener equipos' });
  }
});

// Obtener uno
router.get('/:id', async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.id);
    if (!equipo) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

// Crear con imagen
router.post('/', upload.single('imageFile'), async (req, res) => {
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

// Actualizar con imagen
router.put('/:id', upload.single('imageFile'), async (req, res) => {
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

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await Equipo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Equipo eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar' });
  }
});

export default router;