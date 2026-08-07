import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get, post, ApiError } from '@/services/api';

describe('Serviço de API e Manipulação de Erros', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('deve instanciar a classe ApiError com mensagem e status HTTP corretos', () => {
    const error = new ApiError(401, 'Email ou senha incorretos');
    expect(error.message).toBe('Email ou senha incorretos');
    expect(error.status).toBe(401);
    expect(error.name).toBe('ApiError');
  });

  it('deve realizar requisição GET com sucesso adicionando o token Authorization', async () => {
    localStorage.setItem('neo_token', 'fake-jwt-token');

    const fakeResponse = [{ id: 1, nome: 'Sala 01' }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => fakeResponse,
    });

    const result = await get<{ id: number; nome: string }[]>('/salas');

    expect(result).toEqual(fakeResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/salas'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-jwt-token',
        }),
      })
    );
  });

  it('deve lançar ApiError quando a requisição retornar status de erro (ex: 400 ou 409)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ erro: 'Posição já está ocupada' }),
    });

    await expect(post('/amostras', {})).rejects.toThrow(ApiError);
  });
  
});
