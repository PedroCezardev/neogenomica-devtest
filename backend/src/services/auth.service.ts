import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usuarioRepository } from '../repositories/usuario.repository';
import { AppError } from '../middlewares/AppError';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

export const authService = {

  async findAll() {
    return usuarioRepository.findAll();
  },

  async getProfile(id: number) {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) throw new AppError('Usuário não encontrado', 404);
    return usuario;
  },

  async register(data: RegisterDto) {
    const existing = await usuarioRepository.findByEmail(data.email);
    if (existing) throw new AppError('Email já cadastrado', 409);

    const hash = await bcrypt.hash(data.senha, 10);
    return usuarioRepository.create({ nome: data.nome, email: data.email, senha: hash });
  },

  async login(data: LoginDto) {
    const usuario = await usuarioRepository.findByEmail(data.email);
    // Mensagem genérica — não revela se o email existe ou não (boa prática de segurança)
    if (!usuario) throw new AppError('Email ou senha incorretos', 401);

    const senhaCorreta = await bcrypt.compare(data.senha, usuario.senha);
    if (!senhaCorreta) throw new AppError('Email ou senha incorretos', 401);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('JWT_SECRET não configurado no servidor', 500);

    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}` | number }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  },
};
