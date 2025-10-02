// DEPRECATED: Este controller está depreciado. A lógica de criação de adoção foi unificada com as solicitações de adoção (adoptionRequestController).
// A criação final de uma adoção agora ocorre através da aprovação de uma AdoptionRequest.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAdocao = async (req, res) => {
  const { petId, adotanteId, name, email, phone, address } = req.body;

  try {
    // Verifica se o pet existe e está disponível
    const pet = await prisma.pet.findUnique({
      where: { id: parseInt(petId) },
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    if (pet.status !== 'disponivel') {
      return res.status(400).json({ message: 'Este pet não está disponível para adoção.' });
    }

    // Cria ou encontra o adotante
    let adotante = await prisma.adotante.findUnique({
      where: { id: parseInt(adotanteId) },
    });

    if (!adotante) {
      // Se o adotante não existir, cria um novo
      adotante = await prisma.adotante.create({
        data: {
          name,
          email,
          phone,
          address,
        },
      });
    }

    // Cria a adoção
    const adocao = await prisma.adocao.create({
      data: {
        petId: parseInt(petId),
        adotanteId: adotante.id,
      },
    });

    // Atualiza o status do pet para 'adotado'
    await prisma.pet.update({
      where: { id: parseInt(petId) },
      data: { status: 'adotado' },
    });

    res.status(201).json(adocao);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar adoção.', error: error.message });
  }
};

export const getAdocoes = async (req, res) => {
  try {
    const adocoes = await prisma.adocao.findMany({
      include: {
        pet: true,
        adotante: true,
      },
    });
    res.status(200).json(adocoes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar adoções.', error: error.message });
  }
};

export const getAdocaoById = async (req, res) => {
  const { id } = req.params;
  try {
    const adocao = await prisma.adocao.findUnique({
      where: { id: parseInt(id) },
      include: {
        pet: true,
        adotante: true,
      },
    });
    if (!adocao) {
      return res.status(404).json({ message: 'Adoção não encontrada.' });
    }
    res.status(200).json(adocao);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar adoção.', error: error.message });
  }
};
