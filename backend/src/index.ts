import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import torneosRouter from './routes/torneos';
import equiposRouter from './routes/equipos';
import jugadoresRouter from './routes/jugadores';
import arbitrosRouter from './routes/arbitros';
import posicionesRouter from './routes/posiciones';

dotenv.config(); 

//rutas de usuarios
import userRoutes from './routes/userRoutes';

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

app.use('/api/user', userRoutes);

app.use('/api/torneos', torneosRouter);
app.use('/api/equipos', equiposRouter);
app.use('/api/jugadores', jugadoresRouter);
app.use('/api/arbitros', arbitrosRouter);
app.use('/api/posiciones', posicionesRouter);

app.get('/test', (req, res) => {
  res.json({ mensaje: 'funciona' });
});

app.listen(3002, () => {
  console.log("App corriendo en el puerto: 3002");
});