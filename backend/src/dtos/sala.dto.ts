import { z } from 'zod';

export const createSalaDto = z.object({
  nome: z.string().min(1, 'Nome da sala é obrigatório'),
});

export const updateSalaDto = createSalaDto.partial();

export type CreateSalaDto = z.infer<typeof createSalaDto>;
export type UpdateSalaDto = z.infer<typeof updateSalaDto>;
