import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para criar uma nova adoção
export const createAdocao = async (req, res) => {
  const { petId, adopterId } = req.body;

  // Validação básica
  if (!petId || !adopterId) {
    return res.status(400).json({ message: 'petId e adopterId são obrigatórios.' });
  }

  try {
    // Usamos uma transação para garantir a consistência dos dados
    const novaAdocao = await prisma.$transaction(async (tx) => {
      // 1. Verifica se o pet existe e está disponível
      const pet = await tx.pet.findUnique({
        where: { id: petId },
      });

      if (!pet) {
        throw new Error('Pet não encontrado.');
      }

      if (pet.status !== 'disponivel') {
        throw new Error('Este pet não está disponível para adoção.');
      }

      // 2. Cria o registro de adoção
      const adocao = await tx.adocao.create({
        data: {
          petId: petId,
          adotanteId: parseInt(adopterId, 10), // Garante que o ID do adotante seja um número
        },
      });

      // 3. Atualiza o status do pet para 'adotado'
      await tx.pet.update({
        where: { id: petId },
        data: { status: 'adotado' },
      });

      return adocao;
    });

    res.status(201).json(novaAdocao);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Falha ao registrar a adoção.' });
  }
};

// Função para buscar as adoções do usuário logado (a ser usada no perfil)
export const getMinhasAdocoes = async (req, res) => {
    // O ID do usuário é injetado no req pelo middleware de autenticação
    const userId = req.user.id;

    try {
        const adocoes = await prisma.adocao.findMany({
            where: {
                adotanteId: userId,
            },
            include: {
                pet: true, // Inclui os detalhes do pet em cada adoção
            },
            orderBy: {
                dataAdocao: 'desc',
            }
        });

        res.status(200).json(adocoes);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Falha ao buscar o histórico de adoções.' });
    }
};
