import { z } from 'zod';

export const createAmostraDto = z.object({
  codigoAmostra: z.string().optional(),
  pacienteNome: z.string().min(1, 'Nome do paciente é obrigatório'),
  concentracaoNgUl: z.number().positive('Concentração deve ser positiva').optional(),
  material: z.string().min(1, 'Material é obrigatório (ex: DNA, Swab bucal)'),
  exame: z.string().optional(),
  observacao: z.string().optional(),
  // Localização: onde a amostra vai ser guardada
  posicao: z.string().regex(/^[A-Za-z]\d+$/, 'Posição inválida — use o formato A1, B3, J10, etc.'),
  caixaId: z.number().int().positive('caixaId deve ser um número inteiro positivo'),
});

export const updateAmostraDto = createAmostraDto
  .omit({ posicao: true, caixaId: true }) // localização não é alterada por update
  .partial();

export type CreateAmostraDto = z.infer<typeof createAmostraDto>;
export type UpdateAmostraDto = z.infer<typeof updateAmostraDto>;
