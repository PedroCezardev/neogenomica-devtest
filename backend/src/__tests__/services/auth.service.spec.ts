import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/auth.service';
import { usuarioRepository } from '../../repositories/usuario.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../middlewares/AppError';

vi.mock('../../repositories/usuario.repository', () => ({
  usuarioRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}));

describe('Serviço de Autenticação (auth.service.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.JWT_SECRET = 'secret-teste-super-seguro-123';
  });

  it('deve cadastrar um novo usuário criptografando a senha com bcrypt', async () => {
    vi.mocked(usuarioRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
    vi.mocked(usuarioRepository.create).mockResolvedValue({
      id: 1,
      nome: 'Pedro Cezar',
      email: 'pedro@neogenomica.com',
      senha: 'hashed-password',
      criadoEm: new Date(),
    } as any);

    const user = await authService.register({
      nome: 'Pedro Cezar',
      email: 'pedro@neogenomica.com',
      senha: '123456',
    });

    expect(user.email).toBe('pedro@neogenomica.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
  });

  it('deve lançar AppError 409 se o e-mail já estiver cadastrado no sistema', async () => {
    vi.mocked(usuarioRepository.findByEmail).mockResolvedValue({
      id: 1,
      email: 'existente@neogenomica.com',
    } as any);

    await expect(
      authService.register({
        nome: 'Usuário',
        email: 'existente@neogenomica.com',
        senha: '123456',
      })
    ).rejects.toThrow(AppError);
  });

  it('deve realizar login com sucesso e retornar o token JWT assinado', async () => {
    vi.mocked(usuarioRepository.findByEmail).mockResolvedValue({
      id: 1,
      nome: 'Pedro Cezar',
      email: 'pedro@neogenomica.com',
      senha: 'hashed-password',
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue('jwt-token-valido' as never);

    const resultado = await authService.login({
      email: 'pedro@neogenomica.com',
      senha: '123456',
    });

    expect(resultado.token).toBe('jwt-token-valido');
    expect(resultado.usuario.nome).toBe('Pedro Cezar');
  });

  it('deve lançar AppError 401 Credenciais inválidas se a senha estiver incorreta', async () => {
    vi.mocked(usuarioRepository.findByEmail).mockResolvedValue({
      id: 1,
      email: 'pedro@neogenomica.com',
      senha: 'hashed-password',
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      authService.login({
        email: 'pedro@neogenomica.com',
        senha: 'senha-errada',
      })
    ).rejects.toThrow(AppError);
  });
});
