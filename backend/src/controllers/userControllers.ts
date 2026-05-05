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

// Función para actualizar el perfil del usuario
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, address, city, country } = req.body;
    
    // Buscamos el usuario por su userId que viene del middleware jwtParse
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizamos los datos del usuario
    user.name = name;
    user.address = address;
    user.city = city;
    user.country = country;

    await user.save();

    res.status(200).json(user.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};// Fin de updateUser

// Función para obtener los datos del usuario
export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};
