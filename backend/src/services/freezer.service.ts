import { freezerRepository } from '../repositories/freezer.repository';
import { salaService } from './sala.service';
import { AppError } from '../middlewares/AppError';
import { CreateFreezerDto, UpdateFreezerDto } from '../dtos/freezer.dto';

export const freezerService = {
  async findAll() {
    return freezerRepository.findAll();
  },

  async findById(id: number) {
    const freezer = await freezerRepository.findById(id);
    if (!freezer) throw new AppError('Freezer não encontrado', 404);
    return freezer;
  },

  async create(data: CreateFreezerDto) {
    // Valida se a sala pai existe
    await salaService.findById(data.salaId);
    return freezerRepository.create(data);
  },

  async update(id: number, data: UpdateFreezerDto) {
    await freezerService.findById(id);

    // Se estiver alterando a sala, valida se a nova sala existe
    if (data.salaId) await salaService.findById(data.salaId);

    return freezerRepository.update(id, data);
  },

  async delete(id: number) {
    await freezerService.findById(id);
    return freezerRepository.delete(id);
  },
};
