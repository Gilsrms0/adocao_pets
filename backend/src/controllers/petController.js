import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
// --- IMPORTAÇÃO CORRIGIDA ---
// Importa o caminho do novo módulo de configuração, não mais do server.js
import { UPLOADS_PATH } from '../config/paths.js'; 
// --------------------------

const prisma = new PrismaClient();

// --- Configuração do Multer (Upload de Imagens) ---
// Define UPLOADS_DIR como o UPLOADS_PATH importado
const UPLOADS_DIR = UPLOADS_PATH; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Garante que o Multer aponte corretamente para a pasta
    cb(null, UPLOADS_DIR); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); 
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

export const upload = multer({ storage: storage });
// ----------------------------------------------------


// 1. Cria um novo Pet (Apenas Admin)
export const createPet = async (req, res) => {
  const { name, species, birthDate, description, status } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const userId = req.userId; // Vem do verifyToken

  try {
    if (!userId || req.userRole !== 'ADM') {
      return res.status(403).json({ error: "Acesso negado. Apenas administradores podem cadastrar pets." });
    }
    
    if (!birthDate) {
        return res.status(400).json({ error: "O campo Data de Nascimento é obrigatório." });
    }
    // Converte a string de data para o objeto Date (obrigatório pelo Prisma)
    const dateObject = new Date(birthDate);
    if (isNaN(dateObject.getTime())) { // Melhor verificação de data
        return res.status(400).json({ error: "Formato de data de nascimento inválido." });
    }
    
    const newPet = await prisma.pet.create({
      data: {
        name,
        species,
        description,
        birthDate: dateObject, 
        status: status || 'disponivel', 
        imageUrl,
        ownerId: userId,
      }
    });
    res.status(201).json(newPet);
  } catch (error) {
    console.error("ERRO CRÍTICO AO CADASTRAR PET:", error);
    res.status(500).json({ 
        error: "Erro interno do servidor. Verifique o log detalhado no console do backend." 
    });
  }
};

// 2. Retorna todos os Pets disponíveis (Rota pública)
export const getAllPets = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { status: "disponivel" }
    });
    res.status(200).json(pets);
  } catch (error) {
    console.error("Erro ao buscar pets (disponíveis):", error);
    res.status(500).json({ error: "Erro ao buscar pets." });
  }
};

// 3. Retorna todos os Pets (Incluindo adotados - Apenas Admin)
export const getAllPetsAdmin = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany();
    res.status(200).json(pets);
  } catch (error) {
    console.error("Erro ao buscar todos os pets:", error);
    res.status(500).json({ error: "Erro ao buscar pets." });
  }
};

// 4. Retorna um Pet por ID
export const getPetById = async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await prisma.pet.findUnique({ where: { id: parseInt(id) } });
    if (!pet) {
      return res.status(404).json({ error: "Pet não encontrado." });
    }
    res.status(200).json(pet);
  } catch (error) {
    console.error("Erro ao buscar pet por ID:", error);
    res.status(500).json({ error: "Erro ao buscar pet." });
  }
};

// 5. Atualiza um Pet (Com imagem - Apenas Admin)
export const updatePet = async (req, res) => {
  const { id } = req.params;
  const { name, species, birthDate, description, status } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const dateObject = new Date(birthDate);
    if (isNaN(dateObject.getTime())) { 
        return res.status(400).json({ error: "Formato de data de nascimento inválido." });
    }

    const updatedPet = await prisma.pet.update({
      where: { id: parseInt(id) },
      data: {
        name,
        species,
        birthDate: dateObject,
        description,
        status,
        imageUrl,
      }
    });
    res.status(200).json(updatedPet);
  } catch (error) {
    console.error("Erro ao atualizar pet (com imagem):", error);
    res.status(500).json({ error: "Erro ao atualizar pet." });
  }
};

// 6. Atualiza um Pet (Sem imagem - Apenas Admin)
export const updatePetWithoutImage = async (req, res) => {
  const { id } = req.params;
  const { name, species, birthDate, description, status } = req.body;

  try {
    const dateObject = new Date(birthDate);
    if (isNaN(dateObject.getTime())) {
        return res.status(400).json({ error: "Formato de data de nascimento inválido." });
    }
    
    const updatedPet = await prisma.pet.update({
      where: { id: parseInt(id) },
      data: {
        name,
        species,
        birthDate: dateObject,
        description,
        status,
      }
    });
    res.status(200).json(updatedPet);
  } catch (error) {
    console.error("Erro ao atualizar pet (sem imagem):", error);
    res.status(500).json({ error: "Erro ao atualizar pet." });
  }
};

// 7. Deleta um Pet (Apenas Admin)
export const deletePet = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pet.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
    res.status(500).json({ error: "Erro ao deletar pet." });
  }
};