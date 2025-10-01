import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv'; // Importa dotenv

dotenv.config(); // Carrega as variáveis de ambiente do .env

// --- IMPORTAÇÃO CORRIGIDA ---
// Importa o caminho dos arquivos de configuração
import { UPLOADS_PATH } from './config/paths.js'; 
// --------------------------

// Importações com os caminhos que você nos forneceu
import authRoutes from './auth/authRoutes.js'; 
import petRoutes from './routes/petRoutes.js';
import adotanteRoutes from './routes/adotanteRoutes.js';
import adocaoRoutes from './routes/adocaoRoutes.js'; // Importa a nova rota
import adoptionRequestRoutes from './routes/adoptionRequestRoutes.js';

const app = express();
const prisma = new PrismaClient(); // Inicializa prisma aqui

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Rota estática para servir imagens. Usa UPLOADS_PATH.
app.use('/api/uploads', express.static(UPLOADS_PATH));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adotantes', adotanteRoutes);
app.use('/api/adocoes', adocaoRoutes); // Registra a nova rota
app.use('/api/adoption-requests', adoptionRequestRoutes);

app.get('/', (req, res) => {
  res.send('API de Adoção de Pets está rodando!');
});

// Conecta ao banco de dados antes de iniciar o servidor
async function startServer() {
  try {
    await prisma.$connect();
    console.log("PrismaClient conectado ao banco de dados.");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar PrismaClient ou iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();

// Adiciona handlers para erros não tratados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('exit', async (code) => {
  console.log(`Processo Node.js encerrado com código: ${code}`);
  if (prisma) {
    await prisma.$disconnect();
    console.log("PrismaClient desconectado do banco de dados.");
  }
});