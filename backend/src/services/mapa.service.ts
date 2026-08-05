import { caixaService } from './caixa.service';
import { gerarPosicoes } from '../utils/posicao';

export const mapaService = {
  /**
   * Retorna a grade completa de uma caixa:
   * - Cada célula indica se está livre ou ocupada
   * - Se ocupada, inclui os dados da amostra
   * - Inclui o caminho completo da caixa: Sala / Freezer / Gaveta / Caixa
   */
  async gerarMapa(caixaId: number) {
    const caixa = await caixaService.findById(caixaId); // lança 404 se não existir

    const todasPosicoes = gerarPosicoes(caixa.linhas, caixa.colunas);

    // Mapa de posição → amostra para busca O(1)
    const amostrasMap = new Map(caixa.amostras.map((a) => [a.posicao, a]));

    const grade = todasPosicoes.map((posicao) => {
      const amostra = amostrasMap.get(posicao);
      return {
        posicao,
        livre: !amostra,
        amostra: amostra
          ? {
              id: amostra.id,
              codigoAmostra: amostra.codigoAmostra,
              pacienteNome: amostra.pacienteNome,
              material: amostra.material,
              concentracaoNgUl: amostra.concentracaoNgUl,
              exame: amostra.exame,
            }
          : null,
      };
    });

    // Caminho completo para exibição
    const gaveta = (caixa as any).gaveta;
    const freezer = gaveta?.freezer;
    const sala = freezer?.sala;
    const caminho = sala
      ? `${sala.nome} / ${freezer.nome} / ${gaveta.nome} / ${caixa.nome}`
      : caixa.nome;

    return {
      caixa: {
        id: caixa.id,
        nome: caixa.nome,
        linhas: caixa.linhas,
        colunas: caixa.colunas,
      },
      caminho,
      resumo: {
        totalPosicoes: todasPosicoes.length,
        posicoesOcupadas: amostrasMap.size,
        posicoesLivres: todasPosicoes.length - amostrasMap.size,
        percentualOcupado: Math.round((amostrasMap.size / todasPosicoes.length) * 100),
      },
      grade,
    };
  },
};
