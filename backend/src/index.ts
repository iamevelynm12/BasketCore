import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import torneosRouter from './routes/torneos';
import equiposRouter from './routes/equipos';
import jugadoresRouter from './routes/jugadores';
import arbitrosRouter from './routes/arbitros';
import posicionesRouter from './routes/posiciones';
import userRoutes from './routes/userRoutes';
import morgan from 'morgan';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.DB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Base de datos conectada");
    console.log(process.env.DB_CONNECTION_STRING);
  })
  .catch((error) => {
    console.log(error);
    console.log("Error al conectarse a la base de datos");
  });

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/users', userRoutes);
console.log("Ruta /api/users registrada");
app.use('/api/torneos', torneosRouter);
app.use('/api/equipos', equiposRouter);
app.use('/api/jugadores', jugadoresRouter);
app.use('/api/arbitros', arbitrosRouter);
app.use('/api/posiciones', posicionesRouter);

app.get('/test', (req, res) => {
  res.json({ mensaje: 'Funcionaa' });
});

app.listen(3002, () => {
  console.log("App corriendo en el puerto: 3002");
});

app.use(morgan('dev'));