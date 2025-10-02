import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding do banco de dados...');

  // Limpa as tabelas em ordem para evitar erros de chave estrangeira
  await prisma.adoptionRequest.deleteMany({});
  console.log('Tabela AdoptionRequest limpa.');
  await prisma.adocao.deleteMany({});
  console.log('Tabela Adocao limpa.');
  await prisma.pet.deleteMany({});
  console.log('Tabela Pet limpa.');
  await prisma.user.deleteMany({ where: { role: 'ADOTANTE' } });
  console.log('Contas de adotantes removidas.');

  // --- Recriação do usuário administrador ---
  console.log('Recriando o usuário administrador...');
  // Deleta o usuário admin existente para evitar conflitos de case-sensitivity
  await prisma.user.deleteMany({
    where: {
      email: {
        equals: 'admin@adoteme.com',
        mode: 'insensitive', // Garante que qualquer variação de case seja encontrada
      },
    },
  });

  const adminPassword = await bcrypt.hash('admin0793', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@adoteme.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log(`Usuário administrador recriado com ID: ${adminUser.id}`);
  // --- FIM DA RECRIAÇÃO ---

  const pet1 = await prisma.pet.create({
    data: {
      name: 'Bob',
      species: 'CACHORRO',
      birthDate: new Date('2023-05-10T00:00:00.000Z'),
      description: 'Um cachorro muito brincalhão e cheio de energia, adora correr e brincar com bolinhas.',
      imageUrl: '/uploads/Bob.png',
      status: 'disponivel',
      tamanho: 'MEDIO',
      personalidade: 'Brincalhão, Leal, Energético',
    },
  });
  console.log(`Criado pet com ID: ${pet1.id} (Bob)`);

  const pet2 = await prisma.pet.create({
    data: {
      name: 'Luna',
      species: 'GATO',
      birthDate: new Date('2022-03-20T00:00:00.000Z'),
      description: 'Gata carinhosa e independente, adora tirar sonecas ao sol e receber carinhos na cabeça.',
      imageUrl: '/uploads/Luna.png',
      status: 'disponivel',
      tamanho: 'PEQUENO',
      personalidade: 'Carinhosa, Independente, Curiosa',
    },
  });
  console.log(`Criado pet com ID: ${pet2.id} (Luna)`);

  const pet3 = await prisma.pet.create({
    data: {
      name: 'Pernalonga',
      species: 'COELHO',
      birthDate: new Date('2024-01-01T00:00:00.000Z'),
      description: 'Coelho fofo e tranquilo, gosta de cenouras e de ficar no colo.',
      imageUrl: '/uploads/Pernalonga.png',
      status: 'disponivel',
      tamanho: 'PEQUENO',
      personalidade: 'Tranquilo, Fofo, Calmo',
    },
  });
  console.log(`Criado pet com ID: ${pet3.id} (Pernalonga)`);

  const pet4 = await prisma.pet.create({
    data: {
      name: 'Thor',
      species: 'CACHORRO',
      birthDate: new Date('2021-11-05T00:00:00.000Z'),
      description: 'Cachorro grande e protetor, ideal para famílias com espaço.',
      imageUrl: '/uploads/Thor.png',
      status: 'disponivel',
      tamanho: 'GRANDE',
      personalidade: 'Protetor, Leal, Calmo',
    },
  });
  console.log(`Criado pet com ID: ${pet4.id} (Thor)`);

  const pet5 = await prisma.pet.create({
    data: {
      name: 'Max',
      species: 'CACHORRO',
      birthDate: new Date('2023-04-05T00:00:00.000Z'),
      description: 'Cachorro grande e protetor, ideal para famílias com espaço.',
      imageUrl: '/uploads/Max.png',
      status: 'disponivel',
      tamanho: 'GRANDE',
      personalidade: 'Protetor, Leal, Calmo',
    },
  });
  console.log(`Criado pet com ID: ${pet5.id} (Max)`);

  const pet6 = await prisma.pet.create({
    data: {
      name: 'Mimi',
      species: 'GATO',
      birthDate: new Date('2025-12-20T00:00:00.000Z'),
      description: 'Gata carinhosa e independente, adora tirar sonecas ao sol e receber carinhos na cabeça.',
      imageUrl: '/uploads/Mimi.png',
      status: 'disponivel',
      tamanho: 'PEQUENO',
      personalidade: 'Carinhosa, Independente, Curiosa',
    },
  });
  console.log(`Criado pet com ID: ${pet6.id} (Mimi)`);


  console.log('Seeding concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });