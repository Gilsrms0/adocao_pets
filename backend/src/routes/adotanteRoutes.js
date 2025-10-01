import express from 'express';
// Controller é importado corretamente
import { createAdotante, getAdotantes, getAdotanteById, updateAdotante, deleteAdotante } from '../controllers/adotanteController.js';

// CORREÇÃO FINAL DO CAMINHO: Assumindo src/auth/authMiddleware.js
import { verifyToken, isAdmin } from '../auth/authMiddleware.js'; 

const router = express.Router();

// Rotas protegidas (apenas Admin)
router.get('/', verifyToken, isAdmin, getAdotantes); 
router.get('/:id', verifyToken, isAdmin, getAdotanteById);

router.post('/', createAdotante); 
router.put('/:id', verifyToken, isAdmin, updateAdotante);
router.delete('/:id', verifyToken, isAdmin, deleteAdotante);

export default router;