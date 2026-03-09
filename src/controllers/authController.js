import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';
import { config } from '../config/env.js';
import {
  successResponse,
  errorResponse,
} from '../utils/response.js';

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(
        res,
        'Username e password são obrigatórios',
        400
      );
    }

    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return errorResponse(res, 'Credenciais inválidas', 401);
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValidPassword) {
      return errorResponse(res, 'Credenciais inválidas', 401);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      },
      'Login realizado com sucesso'
    );
  } catch (error) {
    next(error);
  }
};

export { login };
