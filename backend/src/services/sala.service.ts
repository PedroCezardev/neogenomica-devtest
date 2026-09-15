import { salaRepository } from '../repositories/sala.repository';
import { AppError } from '../middlewares/AppError';
import { CreateSalaDto, UpdateSalaDto } from '../dtos/sala.dto';

export const salaService = {
  async findAll() {
    return salaRepository.findAll();
  },

  async findById(id: number) {
    const sala = await salaRepository.findById(id);
    if (!sala) throw new AppError('Sala não encontrada', 404);
    return sala;
  },

  async create(data: CreateSalaDto) {
    return salaRepository.create(data);
    // Nota: o banco já garante @unique no nome — o errorHandler captura P2002
  },

  async update(id: number, data: UpdateSalaDto) {
    await salaService.findById(id); // lança 404 se não existir
    return salaRepository.update(id, data);
  },

  async delete(id: number) {
    await salaService.findById(id); // lança 404 se não existir
    return salaRepository.delete(id);
    // Nota: a deleção em cascata de Freezers/Gavetas/Caixas é tratada pelo Prisma (onDelete: Cascade)
  },
};
