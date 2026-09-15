import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './AppError';

// Extende o tipo Request do Express para incluir o userId extraído do token
export interface AuthRequest extends Request {
  usuarioId?: number;
  usuarioEmail?: string;
}

/**
 * Middleware de autenticação JWT.
 * Valida o token Bearer no header Authorization.
 * Injeta usuarioId e usuarioEmail no request para uso nos controllers.
 *
 * Uso nas rotas:
 *   router.post('/', authMiddleware, controller.create);
 */
export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token de autenticação não fornecido. Faça login primeiro.', 401);
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError('JWT_SECRET não configurado', 500);

  try {
    const payload = jwt.verify(token, secret) as { userId: number; email: string };
    req.usuarioId = payload.userId;
    req.usuarioEmail = payload.email;
    next();
  } catch {
    throw new AppError('Token inválido ou expirado. Faça login novamente.', 401);
  }
}
