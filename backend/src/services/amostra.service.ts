import { amostraRepository } from '../repositories/amostra.repository';
import { caixaService } from './caixa.service';
import { AppError } from '../middlewares/AppError';
import { isPosicaoValida } from '../utils/posicao';
import { CreateAmostraDto, UpdateAmostraDto } from '../dtos/amostra.dto';

export const amostraService = {
  async findAll(filtros?: {
    busca?: string;
    codigoAmostra?: string;
    pacienteNome?: string;
    material?: string;
    exame?: string;
    freezerId?: number;
    gavetaId?: number;
    caixaId?: number;
  }) {
    return amostraRepository.findAll(filtros);
  },

  async findById(id: number) {
    const amostra = await amostraRepository.findById(id);
    if (!amostra) throw new AppError('Amostra não encontrada', 404);
    return amostra;
  },

  async create(data: CreateAmostraDto) {
    // 1. Valida se a caixa existe
    const caixa = await caixaService.findById(data.caixaId);

    // 2. Valida se a posição é válida para o tamanho da caixa
    const posicao = data.posicao.toUpperCase();
    if (!isPosicaoValida(posicao, caixa.linhas, caixa.colunas)) {
      throw new AppError(
        `Posição "${posicao}" é inválida para a caixa "${caixa.nome}" (${caixa.linhas} linhas × ${caixa.colunas} colunas).`,
        400
      );
    }

    // 3. Valida se a posição já está ocupada
    const ocupadas = await amostraRepository.findByCaixa(data.caixaId);
    const jaOcupada = ocupadas.some((a) => a.posicao === posicao);
    if (jaOcupada) {
      throw new AppError(
        `Posição "${posicao}" já está ocupada na caixa "${caixa.nome}". Escolha outra posição.`,
        409
      );
    }

    return amostraRepository.create({ ...data, posicao });
  },

  async update(id: number, data: UpdateAmostraDto) {
    await amostraService.findById(id);
    return amostraRepository.update(id, data);
  },

  async delete(id: number) {
    await amostraService.findById(id);
    return amostraRepository.delete(id);
  },
};
