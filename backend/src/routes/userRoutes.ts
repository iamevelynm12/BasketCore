import express from 'express';
import { createUser, updateUser, getUser } from '../controllers/userControllers';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateUserRequest } from '../middleware/validation';

const router = express.Router();

// Ruta POST: /api/user — crear usuario
router.post('/', jwtCheck, createUser);

// Ruta PUT: /api/user — actualizar perfil
router.put('/', jwtCheck, jwtParse, validateUserRequest, updateUser);

// Ruta GET: /api/user — obtener datos del usuario
router.get('/', (req,res,next)=>{
    console.log("GET /api/user recibido");
    next();
}, jwtCheck, jwtParse,getUser);

export default router;
