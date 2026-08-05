import { caixaRepository } from '../repositories/caixa.repository';
import { gavetaService } from './gaveta.service';
import { AppError } from '../middlewares/AppError';
import { CreateCaixaDto, UpdateCaixaDto } from '../dtos/caixa.dto';

export const caixaService = {
  async findAll() {
    return caixaRepository.findAll();
  },

  async findById(id: number) {
    const caixa = await caixaRepository.findById(id);
    if (!caixa) throw new AppError('Caixa não encontrada', 404);
    return caixa;
  },

  async create(data: CreateCaixaDto) {
    // Valida se a gaveta pai existe
    const gaveta = await gavetaService.findById(data.gavetaId);

    // BÔNUS: verifica limite de caixas da gaveta
    if (gaveta.maxCaixas !== null && gaveta.maxCaixas !== undefined) {
      const totalCaixas = await gavetaRepository.countCaixas(data.gavetaId);
      if (totalCaixas >= gaveta.maxCaixas) {
        throw new AppError(
          `Gaveta "${gaveta.nome}" já atingiu o limite de ${gaveta.maxCaixas} caixas. Remova uma caixa ou escolha outra gaveta.`,
          409
        );
      }
    }

    return caixaRepository.create(data);
  },

  async update(id: number, data: UpdateCaixaDto) {
    await caixaService.findById(id);

    if (data.gavetaId) await gavetaService.findById(data.gavetaId);

    return caixaRepository.update(id, data);
  },

  async delete(id: number) {
    const caixa = await caixaService.findById(id);

    // Protege deleção se houver amostras na caixa
    if (caixa.amostras && caixa.amostras.length > 0) {
      throw new AppError(
        `Não é possível remover a caixa "${caixa.nome}" pois ela contém ${caixa.amostras.length} amostra(s). Remova as amostras primeiro.`,
        409
      );
    }

    return caixaRepository.delete(id);
  },
};

// Import separado para evitar circular dependency
import { gavetaRepository } from '../repositories/gaveta.repository';
