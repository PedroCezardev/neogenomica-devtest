import { get, post, put, del } from './api';
import { Sala } from '@/types';

export interface CreateSalaData {
  nome: string;
}

export interface UpdateSalaData {
  nome?: string;
}

export const salaService = {
  async getAll(): Promise<Sala[]> {
    return get<Sala[]>('/salas');
  },

  async getById(id: number): Promise<Sala> {
    return get<Sala>(`/salas/${id}`);
  },

  async create(data: CreateSalaData): Promise<Sala> {
    return post<Sala>('/salas', data);
  },

  async update(id: number, data: UpdateSalaData): Promise<Sala> {
    return put<Sala>(`/salas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return del(`/salas/${id}`);
  },
};
