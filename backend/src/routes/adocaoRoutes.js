import { Router } from 'express';
import { createAdocao, getMinhasAdocoes } from '../controllers/adocaoController.js';
import { verifyToken } from '../auth/authMiddleware.js';

const router = Router();

// Rota para registrar uma nova adoção
// Protegida para garantir que apenas usuários logados possam adotar
router.post('/', verifyToken, createAdocao);

// Rota para o usuário logado ver seu histórico de adoções
router.get('/me', verifyToken, getMinhasAdocoes);

export default router;
