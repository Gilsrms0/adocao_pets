import express from 'express';
import { createAdoptionRequest, getAdoptionRequests, updateAdoptionRequest } from '../controllers/adoptionRequestController.js';
import { verifyToken, isAdmin } from '../auth/authMiddleware.js';

const router = express.Router();

// Rota agora protegida para criar uma nova solicitação de adoção
router.post('/', verifyToken, createAdoptionRequest);

// Rotas protegidas para administradores
router.get('/', verifyToken, isAdmin, getAdoptionRequests);
router.put('/:id', verifyToken, isAdmin, updateAdoptionRequest);

export default router;
