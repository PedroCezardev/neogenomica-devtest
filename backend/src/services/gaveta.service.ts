import { gavetaRepository } from '../repositories/gaveta.repository';
import { freezerService } from './freezer.service';
import { AppError } from '../middlewares/AppError';
import { CreateGavetaDto, UpdateGavetaDto } from '../dtos/gaveta.dto';

export const gavetaService = {
  async findAll() {
    return gavetaRepository.findAll();
  },

  async findById(id: number) {
    const gaveta = await gavetaRepository.findById(id);
    if (!gaveta) throw new AppError('Gaveta não encontrada', 404);
    return gaveta;
  },

  async create(data: CreateGavetaDto) {
    // Valida se o freezer pai existe
    const freezer = await freezerService.findById(data.freezerId);

    // BÔNUS: verifica limite de gavetas do freezer
    if (freezer.maxGavetas !== null && freezer.maxGavetas !== undefined) {
      const totalGavetas = await gavetaRepository.countGavetas(data.freezerId);
      if (totalGavetas >= freezer.maxGavetas) {
        throw new AppError(
          `Freezer "${freezer.nome}" já atingiu o limite de ${freezer.maxGavetas} gavetas. Remova uma gaveta ou escolha outro freezer.`,
          409
        );
      }
    }

    return gavetaRepository.create(data);
  },

  async update(id: number, data: UpdateGavetaDto) {
    await gavetaService.findById(id);

    if (data.freezerId) await freezerService.findById(data.freezerId);

    return gavetaRepository.update(id, data);
  },

  async delete(id: number) {
    await gavetaService.findById(id);
    return gavetaRepository.delete(id);
  },
};
