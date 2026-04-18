import mongoose from 'mongoose';

const equipoSchema = new mongoose.Schema({
  nombre_equipo: { type: String, required: true },
  abreviatura: { type: String, required: true },
  categoria: { type: String, required: true },
  entrenador: { type: String, required: true },
  carrera: { type: String },
  ganadas: { type: Number, default: 0 },
  derrotas: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Equipo', equipoSchema);