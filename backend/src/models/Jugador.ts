import mongoose from 'mongoose';

const jugadorSchema = new mongoose.Schema({
  nombre_jugador: { type: String, required: true },
  num_playera: { type: Number, required: true },
  posicion: { type: String },
  num_control: { type: String },
  carrera: { type: String },
  puntos_totales: { type: Number, default: 0 },
  asistencias: { type: Number, default: 0 },
  id_equipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' },
}, { timestamps: true });

export default mongoose.model('Jugador', jugadorSchema);