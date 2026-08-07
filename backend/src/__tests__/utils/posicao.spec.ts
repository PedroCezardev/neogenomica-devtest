import { describe, it, expect } from 'vitest';
import { gerarPosicoes, isPosicaoValida } from '../../utils/posicao';

describe('Utilitários de Posição de Bancada (posicao.ts)', () => {
  it('deve gerar 100 posições sequenciais em ordem linha a linha (A1..A10, B1..J10) para caixa 10x10', () => {
    const posicoes = gerarPosicoes(10, 10);
    expect(posicoes).toHaveLength(100);
    expect(posicoes[0]).toBe('A1');
    expect(posicoes[9]).toBe('A10');
    expect(posicoes[10]).toBe('B1');
    expect(posicoes[99]).toBe('J10');
  });

  it('deve validar corretamente se uma posição está dentro dos limites da caixa', () => {
    expect(isPosicaoValida('A1', 10, 10)).toBe(true);
    expect(isPosicaoValida('J10', 10, 10)).toBe(true);
    expect(isPosicaoValida('E5', 10, 10)).toBe(true);
  });

  it('deve rejeitar posições fora dos limites de linha ou coluna', () => {
    expect(isPosicaoValida('K1', 10, 10)).toBe(false); // Linha K é a 11ª (máx 10)
    expect(isPosicaoValida('A11', 10, 10)).toBe(false); // Coluna 11 excede limite 10
    expect(isPosicaoValida('Z99', 10, 10)).toBe(false);
  });

  it('deve rejeitar formatos de posição inválidos', () => {
    expect(isPosicaoValida('123', 10, 10)).toBe(false);
    expect(isPosicaoValida('AA', 10, 10)).toBe(false);
    expect(isPosicaoValida('', 10, 10)).toBe(false);
  });
});
