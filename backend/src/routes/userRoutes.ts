import express from 'express';
import { createUser } from '../controllers/userControllers';
import { jwtCheck } from '../middleware/auth'

const router = express.Router();

// Ruta POST: /api/user
router.post('/', jwtCheck, createUser);

export default router;
