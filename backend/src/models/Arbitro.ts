import mongoose from 'mongoose';

const arbitroSchema = new mongoose.Schema({
  nombre_arbitro: { type: String, required: true },
  telefono: { type: String },
  email: { type: String },
}, { timestamps: true });

export default mongoose.model('Arbitro', arbitroSchema);