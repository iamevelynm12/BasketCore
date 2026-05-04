import { Request, Response } from 'express';
import User from '../models/userModels';

// Función para crear un usuario en BasketCore
export const createUser = async (req: Request, res: Response): Promise<any> => {
  // 1. Aquí irá la lógica para verificar si el usuario ya existe
    // 2. Crear el usuario si no existe
    // 3. Regresar el objeto usuario al frontend
    try {
        const { auth0Id } =req.body;
        const existingUser = await User.findOne( {auth0Id});

        if (existingUser){//si el usuario ya existe en la bd
            return res.status(200)
            .json(existingUser);
        }
        const newUser = new User(req.body)
        await newUser.save();

    
    res.status(201)
    .json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};// Fin de create user
