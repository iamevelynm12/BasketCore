import mongoose from 'mongoose';

const torneoSchema = new mongoose.Schema({
  nombre_torneo: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_final: { type: Date, required: true },
  categoria: { type: String, required: true },
  sede: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Torneo', torneoSchema);