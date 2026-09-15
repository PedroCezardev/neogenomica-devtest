import { get, post, put, del } from './api';
import { Caixa, MapaCaixa } from '@/types';

export interface CreateCaixaData {
  nome: string;
  gavetaId: number;
  linhas: number;
  colunas: number;
}

export interface UpdateCaixaData {
  nome?: string;
  gavetaId?: number;
}

export const caixaService = {
  async getAll(): Promise<Caixa[]> {
    return get<Caixa[]>('/caixas');
  },

  async getById(id: number): Promise<Caixa> {
    return get<Caixa>(`/caixas/${id}`);
  },

  async getMapa(id: number): Promise<MapaCaixa> {
    return get<MapaCaixa>(`/caixas/${id}/mapa`);
  },

  async create(data: CreateCaixaData): Promise<Caixa> {
    return post<Caixa>('/caixas', data);
  },

  async update(id: number, data: UpdateCaixaData): Promise<Caixa> {
    return put<Caixa>(`/caixas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return del(`/caixas/${id}`);
  },
};
