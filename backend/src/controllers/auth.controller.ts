import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerDto, loginDto } from '../dtos/auth.dto';
import { AuthRequest } from '../middlewares/auth.middleware';

export const authController = {

  // Listar todos os usuários (rota protegida por authMiddleware na definição das rotas)
  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios = await authService.findAll();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  },

  // Retorna o perfil do usuário autenticado extraindo o ID do token JWT
  // req deve ser AuthRequest pois o authMiddleware injeta req.usuarioId
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.usuarioId) {
        // Isso não deve acontecer se authMiddleware estiver na rota, mas é um guard de segurança
        res.status(401).json({ erro: 'Não autenticado' });
        return;
      }
      const usuario = await authService.getProfile(req.usuarioId);
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerDto.parse(req.body);
      const usuario = await authService.register(data);
      res.status(201).json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginDto.parse(req.body);
      const resultado = await authService.login(data);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },

};

