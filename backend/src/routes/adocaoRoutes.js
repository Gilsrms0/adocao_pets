// DEPRECATED: Estas rotas estão depreciadas para a criação de novas adoções diretas.
// A criação de adoções agora é iniciada via `adoptionRequestRoutes` e finalizada por um administrador.

import express from 'express';
import { createAdocao, getAdocoes, getAdocaoById, getMyAdocoes } from '../controllers/adocaoController.js';
import { verifyToken } from '../auth/authMiddleware.js'; // Corrigido de authMiddleware para verifyToken

const router = express.Router();

// Rota para o usuário logado buscar seu histórico de adoções
router.get('/me', verifyToken, getMyAdocoes);

// Rota para registrar uma nova adoção (agora depreciada para uso direto pelo frontend)
router.post('/', verifyToken, createAdocao);

// Rotas para buscar adoções (podem ser mantidas para fins administrativos ou históricos)
router.get('/', verifyToken, getAdocoes);
router.get('/:id', verifyToken, getAdocaoById);

export default router;
