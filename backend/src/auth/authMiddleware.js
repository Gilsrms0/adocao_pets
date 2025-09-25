import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
  }

  try {
    // ATENÇÃO: Verifique se essa chave está no seu arquivo .env
    const secret = process.env.JWT_SECRET || "SEGREDO_SUPER_SECRETO"; 
    const decoded = jwt.verify(token, secret);
    
    // Adiciona o ID do usuário decodificado à requisição
    req.userId = decoded.userId; 
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token inválido ou expirado." });
  }
};

export const isAdmin = async (req, res, next) => {
  // Se o verifyToken não decodificou o userId ou o role, ele não deve passar.
  if (!req.userId) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (user && user.role === 'ADM') { // Assumindo 'ADM' como a role do administrador
      next();
    } else {
      res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};