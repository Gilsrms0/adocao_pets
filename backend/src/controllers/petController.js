import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { UPLOADS_PATH } from '../config/paths.js';

const prisma = new PrismaClient();

const UPLOADS_DIR = UPLOADS_PATH;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

export const upload = multer({ storage: storage });

// 1. Cria um novo Pet (Apenas Admin)
export const createPet = async (req, res) => {
  const { name, species, birthDate, description, status, tamanho, personalidade } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const userId = req.userId;

  try {
    if (!userId || req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: "Acesso negado. Apenas administradores podem cadastrar pets." });
    }

    if (!name || !species || !birthDate || !description) {
        return res.status(400).json({ error: "Campos obrigatórios (nome, espécie, data de nascimento, descrição) não foram preenchidos." });
    }

    const dateObject = new Date(birthDate);
    if (isNaN(dateObject.getTime())) {
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
        tamanho,
        personalidade,
        ownerId: userId,
      }
    });
    res.status(201).json(newPet);
  } catch (error) {
    console.error("ERRO CRÍTICO AO CADASTRAR PET:", error);
    res.status(500).json({ error: "Erro interno do servidor ao cadastrar pet." });
  }
};

// 2. Retorna todos os Pets com paginação e busca (Rota pública)
export const getAllPets = async (req, res) => {
  const { species, status, search, page, pageSize } = req.query;

  const where = {};
  if (species && species !== 'all') where.species = species;
  // Se status não for fornecido ou for 'all', não aplica filtro de status
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  let skip = undefined;
  let take = undefined;

  if (page && pageSize) {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);
    skip = (pageNum - 1) * pageSizeNum;
    take = pageSizeNum;
  }

  try {
    const total = await prisma.pet.count({ where });
    const data = await prisma.pet.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' }
    });

    res.status(200).json({ data, total });
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).json({ error: "Erro interno do servidor ao buscar pets." });
  }
};

// 3. Retorna todos os Pets (Incluindo adotados - Apenas Admin)
export const getAllPetsAdmin = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({ orderBy: { id: 'desc' } });
    res.status(200).json(pets);
  } catch (error) {
    console.error("Erro ao buscar todos os pets para admin:", error);
    res.status(500).json({ error: "Erro ao buscar pets para admin." });
  }
};

// 4. Retorna um Pet por ID
export const getPetById = async (req, res) => {
  const { id } = req.params;
  console.log(`DEBUG: getPetById chamado. ID: ${id}, URL: ${req.url}`); // DEBUG LOG
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

// 5. Atualiza um Pet (Apenas Admin - LÓGICA MELHORADA)
export const updatePet = async (req, res) => {
  const { id } = req.params;
  const { name, species, birthDate, description, status, tamanho, personalidade } = req.body;
  
  const dataToUpdate = {};

  if (name) dataToUpdate.name = name;
  if (species) dataToUpdate.species = species;
  if (description) dataToUpdate.description = description;
  if (status) dataToUpdate.status = status;
  if (tamanho) dataToUpdate.tamanho = tamanho;
  if (personalidade) dataToUpdate.personalidade = personalidade;

  if (birthDate) {
    const dateObject = new Date(birthDate);
    if (isNaN(dateObject.getTime())) {
      return res.status(400).json({ error: "Formato de data de nascimento inválido." });
    }
    dataToUpdate.birthDate = dateObject;
  }

  if (req.file) {
    dataToUpdate.imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedPet = await prisma.pet.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });
    res.status(200).json(updatedPet);
  } catch (error) {
    console.error("Erro ao atualizar pet:", error);
    res.status(500).json({ error: "Erro ao atualizar pet." });
  }
};

// 6. Deleta um Pet (Apenas Admin)
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