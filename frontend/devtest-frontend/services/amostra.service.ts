import { get, post, put, del, upload } from './api';
import { Amostra, AmostraFiltros, SugestaoResponse, ImportacaoResult } from '@/types';

export interface CreateAmostraData {
  codigoAmostra?: string | null;
  pacienteNome: string;
  concentracaoNgUl?: number | null;
  material: string;
  exame?: string | null;
  observacao?: string | null;
  posicao: string;
  caixaId: number;
}

export interface UpdateAmostraData {
  codigoAmostra?: string | null;
  pacienteNome?: string;
  concentracaoNgUl?: number | null;
  material?: string;
  exame?: string | null;
  observacao?: string | null;
}

export const amostraService = {
  async getAll(filtros?: AmostraFiltros): Promise<Amostra[]> {
    return get<Amostra[]>('/amostras', filtros as Record<string, string | number>);
  },

  async getById(id: number): Promise<Amostra> {
    return get<Amostra>(`/amostras/${id}`);
  },

  async sugerirPosicao(): Promise<SugestaoResponse> {
    return get<SugestaoResponse>('/amostras/sugerir-posicao');
  },

  async create(data: CreateAmostraData): Promise<Amostra> {
    return post<Amostra>('/amostras', data);
  },

  async importarCSV(file: File): Promise<ImportacaoResult> {
    const formData = new FormData();
    formData.append('arquivo', file);
    return upload<ImportacaoResult>('/amostras/importar', formData);
  },

  async update(id: number, data: UpdateAmostraData): Promise<Amostra> {
    return put<Amostra>(`/amostras/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return del(`/amostras/${id}`);
  },
};