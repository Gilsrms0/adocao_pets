import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Criar uma nova solicitação de adoção (LÓGICA ATUALIZADA)
export const createAdoptionRequest = async (req, res) => {
  // O `userId` vem do middleware `verifyToken`
  const { userId } = req;
  const { adopterName, adopterEmail, adopterPhone, adopterAddress, city, state, neighborhood, number, petId } = req.body;

  // Validação básica de entrada
  if (!adopterName || !adopterEmail || !adopterPhone || !adopterAddress || !city || !state || !neighborhood || !number || !petId) {
    return res.status(400).json({ message: 'Todos os campos do formulário são obrigatórios.' });
  }

  try {
    // Verifica se já existe uma solicitação PENDENTE para o mesmo pet
    const existingRequest = await prisma.adoptionRequest.findFirst({
      where: { 
        petId: parseInt(petId),
        status: 'PENDING',
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Já existe uma solicitação pendente para este pet.' });
    }

    // Busca o usuário logado para garantir consistência de email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.email !== adopterEmail) {
        return res.status(403).json({ message: "O e-mail do formulário não corresponde ao do usuário autenticado." });
    }

    // Encontra ou cria o perfil de Adotante
    let adotante = await prisma.adotante.findUnique({
        where: { email: user.email },
    });

    if (!adotante) {
        adotante = await prisma.adotante.create({
            data: {
                name: adopterName,
                email: adopterEmail,
                phone: adopterPhone,
                address: `${adopterAddress}, ${number}, ${neighborhood}, ${city} - ${state}`,
            },
        });
    }

    // Cria a solicitação de adoção usando o ID do adotante encontrado ou criado
    const newRequest = await prisma.adoptionRequest.create({
      data: {
        adopterName,
        adopterEmail,
        adopterPhone,
        adopterAddress,
        city,
        state,
        neighborhood,
        number,
        petId: parseInt(petId),
        adotanteId: adotante.id, // USA O ID CORRETO
      },
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Erro ao criar solicitação de adoção:", error);
    res.status(500).json({ message: 'Erro ao criar solicitação de adoção.', error: error.message });
  }
};

// 2. Listar todas as solicitações de adoção (para admins)
export const getAdoptionRequests = async (req, res) => {
  try {
    const requests = await prisma.adoptionRequest.findMany({
      include: {
        pet: true, // Inclui os dados do pet relacionado
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar solicitações de adoção.', error: error.message });
  }
};

// 3. Atualizar o status de uma solicitação (aprovar/recusar)
export const updateAdoptionRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'APPROVED' ou 'DENIED'

  if (status !== 'APPROVED' && status !== 'DENIED') {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  try {
    const request = await prisma.adoptionRequest.findUnique({ where: { id: parseInt(id) } });
    if (!request) {
      return res.status(404).json({ message: 'Solicitação não encontrada.' });
    }

    if (status === 'APPROVED') {
      // Inicia uma transação para garantir a consistência dos dados
      const transaction = await prisma.$transaction(async (prisma) => {
        // 1. Cria ou encontra o Adotante
        let adopter = await prisma.adotante.findUnique({ 
          where: { email: request.adopterEmail }
        });

        if (!adopter) {
          adopter = await prisma.adotante.create({
            data: {
              name: request.adopterName,
              email: request.adopterEmail,
              phone: request.adopterPhone,
              address: request.adopterAddress,
            },
          });
        }

        // 2. Cria a Adoção
        const adoption = await prisma.adocao.create({
          data: {
            petId: request.petId,
            adotanteId: adopter.id,
          },
        });

        // 3. Atualiza o status do Pet para 'adotado'
        await prisma.pet.update({
          where: { id: request.petId },
          data: { status: 'adotado' },
        });

        // 4. Atualiza o status da Solicitação
        const updatedRequest = await prisma.adoptionRequest.update({
          where: { id: parseInt(id) },
          data: { status: 'APPROVED' },
        });

        return { adoption, updatedRequest };
      });

      res.status(200).json(transaction.updatedRequest);

    } else { // Se o status for 'DENIED'
      const updatedRequest = await prisma.adoptionRequest.update({
        where: { id: parseInt(id) },
        data: { status: 'DENIED' },
      });
      res.status(200).json(updatedRequest);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar a solicitação.', error: error.message });
  }
};
