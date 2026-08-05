/**
 * Utilitários de posição para a grade da caixa.
 *
 * Exemplo para uma caixa 10×10:
 *  - Linhas: A, B, C, D, E, F, G, H, I, J
 *  - Colunas: 1, 2, 3, ..., 10
 *  - Posições: A1, A2, ..., A10, B1, ..., J10
 */

/**
 * Gera todas as posições possíveis de uma caixa em ordem linha a linha.
 * Usado pelo algoritmo first-fit.
 */
export function gerarPosicoes(linhas: number, colunas: number): string[] {
  const posicoes: string[] = [];
  for (let l = 0; l < linhas; l++) {
    const letra = String.fromCharCode(65 + l); // 65 = 'A'
    for (let c = 1; c <= colunas; c++) {
      posicoes.push(`${letra}${c}`);
    }
  }
  return posicoes;
}

/**
 * Valida se uma posição (ex: "A1", "J10") é válida para o tamanho da caixa.
 * Retorna false se a letra ou o número estiver fora do range.
 */
export function isPosicaoValida(posicao: string, linhas: number, colunas: number): boolean {
  const match = posicao.toUpperCase().match(/^([A-Z])(\d+)$/);
  if (!match) return false;

  const letra = match[1];
  const numero = parseInt(match[2], 10);

  const linhaIdx = letra.charCodeAt(0) - 'A'.charCodeAt(0); // A=0, B=1, ...

  return linhaIdx >= 0 && linhaIdx < linhas && numero >= 1 && numero <= colunas;
}
