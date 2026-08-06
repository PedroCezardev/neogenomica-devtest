import { get, post, put, del } from './api';
import { Gaveta } from '@/types';

export interface CreateGavetaData {
  nome: string;
  freezerId: number;
  maxCaixas?: number;
}

export interface UpdateGavetaData {
  nome?: string;
  freezerId?: number;
  maxCaixas?: number;
}

export const gavetaService = {
  async getAll(): Promise<Gaveta[]> {
    return get<Gaveta[]>('/gavetas');
  },

  async getById(id: number): Promise<Gaveta> {
    return get<Gaveta>(`/gavetas/${id}`);
  },

  async create(data: CreateGavetaData): Promise<Gaveta> {
    return post<Gaveta>('/gavetas', data);
  },

  async update(id: number, data: UpdateGavetaData): Promise<Gaveta> {
    return put<Gaveta>(`/gavetas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return del(`/gavetas/${id}`);
  },
};