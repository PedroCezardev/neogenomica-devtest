import { get, post, put, del } from './api';
import { Freezer } from '@/types';

export interface CreateFreezerData {
  nome: string;
  salaId: number;
  maxGavetas?: number;
}

export interface UpdateFreezerData {
  nome?: string;
  salaId?: number;
  maxGavetas?: number;
}

export const freezerService = {
  async getAll(): Promise<Freezer[]> {
    return get<Freezer[]>('/freezers');
  },

  async getById(id: number): Promise<Freezer> {
    return get<Freezer>(`/freezers/${id}`);
  },

  async create(data: CreateFreezerData): Promise<Freezer> {
    return post<Freezer>('/freezers', data);
  },

  async update(id: number, data: UpdateFreezerData): Promise<Freezer> {
    return put<Freezer>(`/freezers/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return del(`/freezers/${id}`);
  },
};