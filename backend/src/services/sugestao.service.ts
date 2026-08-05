import prisma from '../lib/prisma';
import { gerarPosicoes } from '../utils/posicao';
import { AppError } from '../middlewares/AppError';

/**
 * Formata o caminho completo: Sala / Freezer / Gaveta / Caixa / Posição
 * Exatamente o formato que o README pede.
 */
function formatarCaminho(caixa: {
  nome: string;
  gaveta: {
    nome: string;
    freezer: { nome: string; sala: { nome: string } };
  };
}, posicao: string): string {
  const { gaveta } = caixa;
  const { freezer } = gaveta;
  const { sala } = freezer;
  return `${sala.nome} / ${freezer.nome} / ${gaveta.nome} / ${caixa.nome} / ${posicao}`;
}

export const sugestaoService = {
  /**
   * Algoritmo First-Fit (exatamente como o README especifica):
   *
   * 1. Percorre as caixas ordenadas por criadoEm ASC (determinístico)
   * 2. Dentro de cada caixa, percorre posições linha a linha: A1, A2..., B1, B2...
   * 3. Retorna a PRIMEIRA posição livre encontrada com o caminho completo
   * 4. Se todas estiverem cheias, avisa e sugere onde abrir nova caixa
   */
  async sugerirPosicao() {
    // Busca todas as caixas com amostras e hierarquia completa
    const caixas = await prisma.caixa.findMany({
      orderBy: { criadoEm: 'asc' },
      include: {
        amostras: { select: { posicao: true } },
        gaveta: {
          include: {
            freezer: { include: { sala: true } },
          },
        },
      },
    });

    if (caixas.length === 0) {
      throw new AppError(
        'Não há caixas cadastradas. Crie uma caixa antes de adicionar amostras.',
        404
      );
    }

    // First-fit: percorrer caixas e posições
    for (const caixa of caixas) {
      const todasPosicoes = gerarPosicoes(caixa.linhas, caixa.colunas);
      const ocupadas = new Set(caixa.amostras.map((a) => a.posicao));
      const posicaoLivre = todasPosicoes.find((p) => !ocupadas.has(p));

      if (posicaoLivre) {
        return {
          encontrou: true as const,
          posicao: posicaoLivre,
          caixaId: caixa.id,
          caminho: formatarCaminho(caixa, posicaoLivre),
          totalLivres: todasPosicoes.length - ocupadas.size,
          caixa: {
            id: caixa.id,
            nome: caixa.nome,
            linhas: caixa.linhas,
            colunas: caixa.colunas,
            gaveta: caixa.gaveta,
          },
        };
      }
    }

    // Todas cheias — sugerir onde abrir nova caixa
    const gavetas = await prisma.gaveta.findMany({
      include: {
        freezer: { include: { sala: true } },
        _count: { select: { caixas: true } },
      },
    });

    // Primeira gaveta que ainda tem espaço para mais caixas
    const gavetaComEspaco = gavetas.find(
      (g) => g.maxCaixas === null || g._count.caixas < (g.maxCaixas ?? Infinity)
    );

    return {
      encontrou: false as const,
      mensagem: 'Todas as posições estão ocupadas. É necessário abrir uma nova caixa para continuar.',
      sugestaoGaveta: gavetaComEspaco ?? null,
    };
  },
};
