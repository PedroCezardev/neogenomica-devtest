import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from '../../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { AppError } from '../../middlewares/AppError';

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
  },
}));

describe('Middleware de Autenticação (auth.middleware.ts)', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.JWT_SECRET = 'secret-teste-super-seguro-123';
    req = { headers: {} };
    res = {};
    next = vi.fn();
  });

  it('deve extrair o token do cabeçalho Authorization e injetar usuarioId e usuarioEmail na requisição', () => {
    req.headers.authorization = 'Bearer token-jwt-valido';
    vi.mocked(jwt.verify).mockReturnValue({ userId: 42, email: 'pedro@neogenomica.com' } as any);

    authMiddleware(req, res, next);

    expect(req.usuarioId).toBe(42);
    expect(req.usuarioEmail).toBe('pedro@neogenomica.com');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('deve lançar AppError 401 Não Autorizado quando o cabeçalho Authorization estiver ausente', () => {
    expect(() => authMiddleware(req, res, next)).toThrow(AppError);
  });

  it('deve lançar AppError 401 quando o token for inválido ou expirado', () => {
    req.headers.authorization = 'Bearer token-invalido';
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('jwt expired');
    });

    expect(() => authMiddleware(req, res, next)).toThrow(AppError);
  });
});
