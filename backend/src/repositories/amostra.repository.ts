import prisma from '../lib/prisma';
import { CreateAmostraDto, UpdateAmostraDto } from '../dtos/amostra.dto';

export const amostraRepository = {
  findAll(filtros?: {
    codigoAmostra?: string;
    pacienteNome?: string;
    material?: string;
    exame?: string;
    caixaId?: number;
  }) {
    return prisma.amostra.findMany({
      where: {
        ...(filtros?.codigoAmostra && {
          codigoAmostra: { contains: filtros.codigoAmostra, mode: 'insensitive' },
        }),
        ...(filtros?.pacienteNome && {
          pacienteNome: { contains: filtros.pacienteNome, mode: 'insensitive' },
        }),
        ...(filtros?.material && { material: filtros.material }),
        ...(filtros?.exame && { exame: { contains: filtros.exame, mode: 'insensitive' } }),
        ...(filtros?.caixaId && { caixaId: filtros.caixaId }),
      },
      include: {
        caixa: {
          include: {
            gaveta: { include: { freezer: { include: { sala: true } } } },
          },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  },

  findById(id: number) {
    return prisma.amostra.findUnique({
      where: { id },
      include: {
        caixa: {
          include: {
            gaveta: { include: { freezer: { include: { sala: true } } } },
          },
        },
      },
    });
  },

  // Busca amostras de uma caixa específica — usado para verificar posições ocupadas
  findByCaixa(caixaId: number) {
    return prisma.amostra.findMany({
      where: { caixaId },
      select: { posicao: true },
    });
  },

  create(data: CreateAmostraDto) {
    return prisma.amostra.create({
      data,
      include: {
        caixa: {
          include: {
            gaveta: { include: { freezer: { include: { sala: true } } } },
          },
        },
      },
    });
  },

  update(id: number, data: UpdateAmostraDto) {
    return prisma.amostra.update({
      where: { id },
      data,
      include: {
        caixa: {
          include: {
            gaveta: { include: { freezer: { include: { sala: true } } } },
          },
        },
      },
    });
  },

  delete(id: number) {
    return prisma.amostra.delete({ where: { id } });
  },
};
