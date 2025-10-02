import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Rota para registrar um novo usuário
export const register = async (req, res) => {
 const { name, email, password, adminKey } = req.body;

 // Defina a chave secreta aqui. Em um projeto real, isso deve vir de um arquivo .env
 const SECRET_ADMIN_KEY = process.env.SECRET_ADMIN_KEY;

 try {
 const hashedPassword = await bcrypt.hash(password, 10);
 
 // Define a role padrão como 'ADOTANTE'
 let role = 'ADOTANTE';

 // Se a chave de administrador for fornecida e correta, a role se torna 'ADMIN'
 if (adminKey && adminKey === SECRET_ADMIN_KEY) {
 role = 'ADMIN';
 }

 const newUser = await prisma.user.create({
 data: {
 name,
 email,
 password: hashedPassword,
 role, // Usa a variável 'role' para definir a função do usuário
 }
 });

    // Gerar token JWT para o novo usuário
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: "Usuário registrado com sucesso!", token });
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: "Este e-mail já está cadastrado." });
    }
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
    const token = jwt.sign({ userId: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login realizado com sucesso!", token });
  } catch (error) {
    console.error("Login error:", error); // Adicionado para depuração
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};