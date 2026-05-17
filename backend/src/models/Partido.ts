import mongoose from 'mongoose';

const partidoSchema = new mongoose.Schema({
  id_equipo1: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  id_equipo2: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  puntos_equipo1: { type: Number, default: 0 },
  puntos_equipo2: { type: Number, default: 0 },
  tiempo_horas: { type: Number, default: 20 },
  tiempo_minutos: { type: Number, default: 0 },
  estado: { type: String, default: 'En progreso' } // En progreso, Terminado
}, { timestamps: true });

export default mongoose.model('Partido', partidoSchema);