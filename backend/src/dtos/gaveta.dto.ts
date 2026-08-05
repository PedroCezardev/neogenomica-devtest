import { z } from 'zod';

export const createGavetaDto = z.object({
  nome: z.string().min(1, 'Nome da gaveta é obrigatório'),
  freezerId: z.number().int().positive('freezerId deve ser um número inteiro positivo'),
  maxCaixas: z.number().int().positive('maxCaixas deve ser positivo').optional(),
});

export const updateGavetaDto = createGavetaDto.partial();

export type CreateGavetaDto = z.infer<typeof createGavetaDto>;
export type UpdateGavetaDto = z.infer<typeof updateGavetaDto>;
