import { z } from 'zod';

export const createCaixaDto = z.object({
  nome: z.string().min(1, 'Nome da caixa é obrigatório'),
  gavetaId: z.number().int().positive('gavetaId deve ser um número inteiro positivo'),
  linhas: z
    .number()
    .int()
    .min(1, 'Linhas deve ser no mínimo 1')
    .max(26, 'Máximo de 26 linhas (A-Z)'),
  colunas: z
    .number()
    .int()
    .min(1, 'Colunas deve ser no mínimo 1')
    .max(99, 'Máximo de 99 colunas'),
});

export const updateCaixaDto = createCaixaDto
  .omit({ linhas: true, colunas: true }) // tamanho não pode ser alterado após criação
  .partial();

export type CreateCaixaDto = z.infer<typeof createCaixaDto>;
export type UpdateCaixaDto = z.infer<typeof updateCaixaDto>;
