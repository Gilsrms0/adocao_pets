import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Rota para registrar um novo usuário
export const register = async (req, res) => {
  const { name, email, password, adminKey } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Define a role padrão como 'ADOTANTE'
    let role = 'ADOTANTE';

    // Se a chave de administrador for fornecida e correta, a role se torna 'ADM'
    if (adminKey && adminKey === process.env.SECRET_ADMIN_KEY) {
      role = 'ADMIN'; // CORREÇÃO DE DIGITAÇÃO
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // Usa a variável 'role' para definir a função do usuário
      }
    });

    // Por segurança, cria uma cópia do objeto de usuário sem a propriedade 'password' antes de enviar a resposta.
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ message: "Usuário registrado com sucesso!", user: userWithoutPassword });
  } catch (error) {
    
    // Refinamento: tratando erros com mensagens mais especificas
    if (error.code === 'P2002') {
        return res.status(409).json({error: "O e-mail informado já está em uso."});
    }
    console.error("Erro ao registrar usuário:", error); 
    
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
};

// Rota para fazer o login (mantida sem alterações)
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login realizado com sucesso!", token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};