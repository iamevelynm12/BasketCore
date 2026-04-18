import mongoose from 'mongoose';

const posicionSchema = new mongoose.Schema({
  id_torneo: { type: mongoose.Schema.Types.ObjectId, ref: 'Torneo', required: true },
  id_equipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  puntos_tabla: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Posicion', posicionSchema);