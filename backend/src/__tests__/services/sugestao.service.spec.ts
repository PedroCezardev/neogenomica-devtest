import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sugestaoService } from '../../services/sugestao.service';
import prisma from '../../lib/prisma';
import { AppError } from '../../middlewares/AppError';

// Mock do prisma client
vi.mock('../../lib/prisma', () => ({
  default: {
    caixa: {
      findMany: vi.fn(),
    },
    gaveta: {
      findMany: vi.fn(),
    },
  },
}));

describe('Serviço de Sugestão — Algoritmo First-Fit (sugestao.service.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockHierarquiaCaixa = {
    nome: 'CX-01',
    gaveta: {
      nome: 'Gaveta 1',
      freezer: {
        nome: 'Freezer -20C',
        sala: { nome: 'Pré-PCR' },
      },
    },
  };

  it('Caso 1: Em uma caixa vazia 10x10, o First-Fit deve sugerir a posição A1 com caminho completo', async () => {
    const fakeCaixas = [
      {
        id: 1,
        nome: 'CX-01',
        linhas: 10,
        colunas: 10,
        criadoEm: new Date(),
        amostras: [],
        gaveta: mockHierarquiaCaixa.gaveta,
      },
    ];

    vi.mocked(prisma.caixa.findMany).mockResolvedValue(fakeCaixas as any);

    const resultado = await sugestaoService.sugerirPosicao();

    expect(resultado.encontrou).toBe(true);
    if (resultado.encontrou) {
      expect(resultado.posicao).toBe('A1');
      expect(resultado.caixaId).toBe(1);
      expect(resultado.totalLivres).toBe(100);
      expect(resultado.caminho).toBe('Pré-PCR / Freezer -20C / Gaveta 1 / CX-01 / A1');
    }
  });

  it('Caso 2: Se A1, A2 e A3 estiverem ocupadas, o First-Fit deve pular e sugerir a posição A4', async () => {
    const fakeCaixas = [
      {
        id: 1,
        nome: 'CX-01',
        linhas: 10,
        colunas: 10,
        criadoEm: new Date(),
        amostras: [{ posicao: 'A1' }, { posicao: 'A2' }, { posicao: 'A3' }],
        gaveta: mockHierarquiaCaixa.gaveta,
      },
    ];

    vi.mocked(prisma.caixa.findMany).mockResolvedValue(fakeCaixas as any);

    const resultado = await sugestaoService.sugerirPosicao();

    expect(resultado.encontrou).toBe(true);
    if (resultado.encontrou) {
      expect(resultado.posicao).toBe('A4');
      expect(resultado.totalLivres).toBe(97);
    }
  });

  it('Caso 3: Se a Caixa 1 estiver 100% cheia, o First-Fit deve avançar para a Caixa 2 e sugerir A1', async () => {
    // Caixa 1 de tamanho 2x2 (4 posições) totalmente ocupada
    const fakeCaixa1 = {
      id: 1,
      nome: 'CX-CHEIA',
      linhas: 2,
      colunas: 2,
      criadoEm: new Date('2026-01-01'),
      amostras: [{ posicao: 'A1' }, { posicao: 'A2' }, { posicao: 'B1' }, { posicao: 'B2' }],
      gaveta: mockHierarquiaCaixa.gaveta,
    };

    // Caixa 2 de tamanho 10x10 totalmente livre
    const fakeCaixa2 = {
      id: 2,
      nome: 'CX-LIVRE',
      linhas: 10,
      colunas: 10,
      criadoEm: new Date('2026-01-02'),
      amostras: [],
      gaveta: {
        nome: 'Gaveta 2',
        freezer: mockHierarquiaCaixa.gaveta.freezer,
      },
    };

    vi.mocked(prisma.caixa.findMany).mockResolvedValue([fakeCaixa1, fakeCaixa2] as any);

    const resultado = await sugestaoService.sugerirPosicao();

    expect(resultado.encontrou).toBe(true);
    if (resultado.encontrou) {
      expect(resultado.caixaId).toBe(2);
      expect(resultado.posicao).toBe('A1');
      expect(resultado.caminho).toBe('Pré-PCR / Freezer -20C / Gaveta 2 / CX-LIVRE / A1');
    }
  });

  it('Caso 4: Se todas as caixas estiverem 100% cheias, deve retornar encontrou: false e sugerir gaveta para nova caixa', async () => {
    const fakeCaixaCheia = {
      id: 1,
      nome: 'CX-01',
      linhas: 1,
      colunas: 1,
      criadoEm: new Date(),
      amostras: [{ posicao: 'A1' }],
      gaveta: mockHierarquiaCaixa.gaveta,
    };

    const fakeGavetaComEspaco = {
      id: 1,
      nome: 'Gaveta 1',
      maxCaixas: 5,
      _count: { caixas: 1 },
      freezer: mockHierarquiaCaixa.gaveta.freezer,
    };

    vi.mocked(prisma.caixa.findMany).mockResolvedValue([fakeCaixaCheia] as any);
    vi.mocked(prisma.gaveta.findMany).mockResolvedValue([fakeGavetaComEspaco] as any);

    const resultado = await sugestaoService.sugerirPosicao();

    expect(resultado.encontrou).toBe(false);
    if (!resultado.encontrou) {
      expect(resultado.mensagem).toContain('Todas as posições estão ocupadas');
      expect(resultado.sugestaoGaveta).not.toBeNull();
    }
  });

  it('Caso 5: Se não houver nenhuma caixa cadastrada no banco, deve lançar AppError 404', async () => {
    vi.mocked(prisma.caixa.findMany).mockResolvedValue([]);

    await expect(sugestaoService.sugerirPosicao()).rejects.toThrow(AppError);
  });
});
