import prisma from '../lib/prisma';
import { CreateSalaDto, UpdateSalaDto } from '../dtos/sala.dto';

export const salaRepository = {
  findAll() {
    return prisma.sala.findMany({
      include: {
        _count: { select: { freezers: true } }, // quantos freezers cada sala tem
      },
      orderBy: { criadoEm: 'asc' },
    });
  },

  findById(id: number) {
    return prisma.sala.findUnique({
      where: { id },
      include: {
        freezers: {
          include: {
            _count: { select: { gavetas: true } },
          },
          orderBy: { criadoEm: 'asc' },
        },
      },
    });
  },

  create(data: CreateSalaDto) {
    return prisma.sala.create({ data });
  },

  update(id: number, data: UpdateSalaDto) {
    return prisma.sala.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.sala.delete({ where: { id } });
  },
};
