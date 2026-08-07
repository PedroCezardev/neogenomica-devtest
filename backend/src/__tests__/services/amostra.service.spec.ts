import { describe, it, expect, vi, beforeEach } from 'vitest';
import { amostraService } from '../../services/amostra.service';
import { amostraRepository } from '../../repositories/amostra.repository';
import { caixaService } from '../../services/caixa.service';
import { AppError } from '../../middlewares/AppError';

vi.mock('../../repositories/amostra.repository', () => ({
  amostraRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByCaixa: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../services/caixa.service', () => ({
  caixaService: {
    findById: vi.fn(),
  },
}));

describe('Serviço de Amostras (amostra.service.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockCaixa = {
    id: 1,
    nome: 'CX-01',
    linhas: 10,
    colunas: 10,
    gavetaId: 1,
  };

  it('deve cadastrar uma amostra com sucesso quando a posição estiver livre', async () => {
    vi.mocked(caixaService.findById).mockResolvedValue(mockCaixa as any);
    vi.mocked(amostraRepository.findByCaixa).mockResolvedValue([]); // Nenhuma amostra na caixa
    vi.mocked(amostraRepository.create).mockResolvedValue({
      id: 1,
      codigoAmostra: 'NEO-001',
      pacienteNome: 'Maria Santos',
      material: 'DNA',
      caixaId: 1,
      posicao: 'A1',
      concentracaoNgUl: 45.2,
      exame: 'Sequenciamento Exoma',
      observacao: null,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    } as any);

    const novaAmostra = await amostraService.create({
      pacienteNome: 'Maria Santos',
      material: 'DNA',
      caixaId: 1,
      posicao: 'A1',
      codigoAmostra: 'NEO-001',
      concentracaoNgUl: 45.2,
      exame: 'Sequenciamento Exoma',
    });

    expect(novaAmostra.posicao).toBe('A1');
    expect(novaAmostra.pacienteNome).toBe('Maria Santos');
  });

  it('deve lançar AppError 409 Conflict se a posição já estiver ocupada na mesma caixa', async () => {
    vi.mocked(caixaService.findById).mockResolvedValue(mockCaixa as any);
    // Simula que a vaga A1 já está ocupada por outra amostra
    vi.mocked(amostraRepository.findByCaixa).mockResolvedValue([
      { id: 99, pacienteNome: 'Outro Paciente', posicao: 'A1' } as any,
    ]);

    await expect(
      amostraService.create({
        pacienteNome: 'Novo Paciente',
        material: 'DNA',
        caixaId: 1,
        posicao: 'A1',
      })
    ).rejects.toThrow(AppError);
  });

  it('deve lançar AppError 400 se a posição fornecida for inválida para o tamanho da caixa', async () => {
    vi.mocked(caixaService.findById).mockResolvedValue(mockCaixa as any);

    // K15 excede caixa 10x10
    await expect(
      amostraService.create({
        pacienteNome: 'Teste',
        material: 'DNA',
        caixaId: 1,
        posicao: 'K15',
      })
    ).rejects.toThrow(AppError);
  });

  it('deve buscar amostras aplicando filtro OR entre código ou nome do paciente', async () => {
    vi.mocked(amostraRepository.findAll).mockResolvedValue([
      { id: 1, pacienteNome: 'Ana Paula', codigoAmostra: 'NEO-100' } as any,
    ]);

    const resultado = await amostraService.findAll({ busca: 'Ana' });

    expect(resultado).toHaveLength(1);
    expect(amostraRepository.findAll).toHaveBeenCalledWith({ busca: 'Ana' });
  });
});
