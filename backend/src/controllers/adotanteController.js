import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cria um novo adotante
export const createAdotante = async (req, res) => {
  // Assume que o Multer está configurado na rota se houver imagem (não está aqui no controller)
  const { name, email, phone, address } = req.body; 

  try {
    const newAdotante = await prisma.adotante.create({
      data: { 
        name, 
        email, 
        phone, 
        address, 
      }
    });
    res.status(201).json(newAdotante);
  } catch (error) {
    console.error("Erro ao cadastrar adotante:", error);

    // Refinamento: tratando erros com mensagens mais especificas
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "O e-mail informado já está em uso."}); //409 conflict
    }

    res.status(500).json({ error: "Erro interno ao cadastrar adotante." });
  }
};

// Retorna todos os adotantes
export const getAdotantes = async (req, res) => {
  try {
    const adotantes = await prisma.adotante.findMany();
    res.status(200).json(adotantes);
  } catch (error) {
    console.error("Erro ao buscar adotantes:", error);
    res.status(500).json({ error: "Erro ao buscar adotantes." });
  }
};

// Retorna um adotante por ID
export const getAdotanteById = async (req, res) => {
  const { id } = req.params;
  try {
    const adotante = await prisma.adotante.findUnique({ where: { id: parseInt(id) } });
    if (!adotante) {
      return res.status(404).json({ error: "Adotante não encontrado." });
    }
    res.status(200).json(adotante);
  } catch (error) {
    console.error("Erro ao buscar adotante por ID:", error);
    res.status(500).json({ error: "Erro ao buscar adotante." });
  }
};

// Atualiza um adotante existente
export const updateAdotante = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const updatedAdotante = await prisma.adotante.update({
      where: { id: parseInt(id) },
      data: { name, email, phone, address }
    });
    res.status(200).json(updatedAdotante);
  } catch (error) {
    console.error("Erro ao atualizar adotante:", error);

    // Refinamento: tratando erros com mensagens mais especificas
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Adotante não encontrado."}); //404 Not Found
    }

    res.status(500).json({ error: "Erro interno ao atualizar adotante." });
  }
};

// Deleta um adotante
export const deleteAdotante = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.adotante.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar adotante:", error);

    // Refinamento: tratando erros com mensagens mais especificas
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Adotante não encontrado."}); //404 Not Found
    }

    res.status(500).json({ error: "Erro ao deletar adotante." });
  }
};