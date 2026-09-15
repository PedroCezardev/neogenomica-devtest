import { post, get } from './api';
import { AuthResponse, Usuario } from '@/types';

export const authService = {

  async login(email: string, senha: string): Promise<AuthResponse> {
    const res = await post<AuthResponse>('/auth/login', { email, senha });
    if (typeof window !== 'undefined') {
      localStorage.setItem('neo_token', res.token);
      localStorage.setItem('neo_usuario', JSON.stringify(res.usuario));
    }
    return res;
  },

  async register(nome: string, email: string, senha: string): Promise<Usuario> {
    return post<Usuario>('/auth/register', { nome, email, senha });
  },

  async getMe(): Promise<Usuario> {
    return get<Usuario>('/auth/me');
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('neo_token');
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/login';
    }
  },

  getStoredUser(): { id: number; nome: string; email: string } | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('neo_usuario');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};
