import express from 'express';
// Controller é importado corretamente
import { createAdotante, getAdotantes, getAdotanteById, updateAdotante, deleteAdotante, getMyAdoptionRequests } from '../controllers/adotanteController.js';

// CORREÇÃO FINAL DO CAMINHO: Assumindo src/auth/authMiddleware.js
import { verifyToken, isAdmin } from '../auth/authMiddleware.js'; 

const router = express.Router();

// Nova rota para o adotante logado ver seus pedidos
router.get('/me/adoption-requests', verifyToken, getMyAdoptionRequests);

// Rotas protegidas (apenas Admin)
router.get('/', verifyToken, isAdmin, getAdotantes); 
router.get('/:id', verifyToken, isAdmin, getAdotanteById);

router.post('/', verifyToken, isAdmin, createAdotante); 
router.put('/:id', verifyToken, isAdmin, updateAdotante);
router.delete('/:id', verifyToken, isAdmin, deleteAdotante);

export default router;