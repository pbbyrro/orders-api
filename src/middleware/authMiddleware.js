import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Middleware para validar token JWT nas requisições protegidas
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Extrai token do header Authorization: Bearer <token>
  const token = authHeader?.split(' ')[1];

  if (!token) {
    const error = new Error('Token de autenticação não fornecido');
    error.status = 401;
    return next(error);
  }

  try {
    const user = jwt.verify(token, config.jwt.secret);
    req.user = user;
    next();
  } catch (err) {
    const error = new Error('Token inválido ou expirado');
    error.status = 403;
    return next(error);
  }
};

export { authenticateToken };
