import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdotanteFromUserId = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    return null;
  }

  const adotante = await prisma.adotante.findUnique({
    where: { email: user.email },
  });

  return adotante;
};