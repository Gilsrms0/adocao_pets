import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

// --- IMPORTAÇÃO CORRIGIDA ---
// Importa o caminho dos arquivos de configuração
import { UPLOADS_PATH } from './config/paths.js'; 
// --------------------------

// Importações com os caminhos que você nos forneceu
import authRoutes from './auth/authRoutes.js'; 
import petRoutes from './routes/petRoutes.js';
import adotanteRoutes from './routes/adotanteRoutes.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Rota estática para servir imagens. Usa UPLOADS_PATH.
app.use('/uploads', express.static(UPLOADS_PATH)); // <-- USANDO O CAMINHO CORRETO

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adotantes', adotanteRoutes);

app.get('/', (req, res) => {
  res.send('API de Adoção de Pets está rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});