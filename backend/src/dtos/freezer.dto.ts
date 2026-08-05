import { z } from 'zod';

export const createFreezerDto = z.object({
  nome: z.string().min(1, 'Nome do freezer é obrigatório'),
  salaId: z.number().int().positive('salaId deve ser um número inteiro positivo'),
  maxGavetas: z.number().int().positive('maxGavetas deve ser positivo').optional(),
});

export const updateFreezerDto = createFreezerDto.partial();

export type CreateFreezerDto = z.infer<typeof createFreezerDto>;
export type UpdateFreezerDto = z.infer<typeof updateFreezerDto>;
