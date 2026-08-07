import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SugestaoCard from '@/components/nova-amostra/SugestaoCard';
import { SugestaoResponse } from '@/types';

describe('Componente SugestaoCard (First-Fit)', () => {
  it('deve exibir mensagem de análise durante o carregamento (loading)', () => {
    render(
      <SugestaoCard
        sugestao={null}
        loading={true}
        onBuscarSugestao={vi.fn()}
        onAplicarSugestao={vi.fn()}
        sugestaoAplicada={false}
      />
    );

    expect(screen.getByText(/analisando freezers e caixas/i)).toBeInTheDocument();
  });

  it('deve exibir a vaga encontrada e o caminho físico completo quando a busca for bem-sucedida', () => {
    const fakeSugestao: SugestaoResponse = {
      encontrou: true,
      caixaId: 1,
      posicao: 'C3',
      caminho: 'Pré-PCR / Freezer -20C / Gaveta 1 / CX-CONTROLE / C3',
      totalLivres: 53,
      caixa: { id: 1, nome: 'CX-CONTROLE', linhas: 10, colunas: 10, gavetaId: 1, criadoEm: '', atualizadoEm: '' },
    };

    render(
      <SugestaoCard
        sugestao={fakeSugestao}
        loading={false}
        onBuscarSugestao={vi.fn()}
        onAplicarSugestao={vi.fn()}
        sugestaoAplicada={false}
      />
    );

    expect(screen.getByText('C3')).toBeInTheDocument();
    expect(screen.getByText('CX-CONTROLE')).toBeInTheDocument();
    expect(screen.getByText(/53 vagas restantes/i)).toBeInTheDocument();
    expect(screen.getByText('Pré-PCR / Freezer -20C / Gaveta 1 / CX-CONTROLE / C3')).toBeInTheDocument();
  });

  it('deve exibir alerta quando todas as caixas estiverem cheias (encontrou: false)', () => {
    const fakeCheio: SugestaoResponse = {
      encontrou: false,
      mensagem: 'Todas as caixas cadastradas estão completamente ocupadas.',
      sugestaoGaveta: null,
    };

    render(
      <SugestaoCard
        sugestao={fakeCheio}
        loading={false}
        onBuscarSugestao={vi.fn()}
        onAplicarSugestao={vi.fn()}
        sugestaoAplicada={false}
      />
    );

    expect(screen.getByText(/todas as caixas estão cheias/i)).toBeInTheDocument();
    expect(screen.getByText(/todas as caixas cadastradas estão completamente ocupadas/i)).toBeInTheDocument();
  });

  it('deve disparar a função onAplicarSugestao ao clicar no botão "Usar Esta Posição"', () => {
    const handleAplicar = vi.fn();
    const fakeSugestao: SugestaoResponse = {
      encontrou: true,
      caixaId: 1,
      posicao: 'A1',
      caminho: 'Sala 1 / Freezer A / Gaveta 1 / CX-01 / A1',
      totalLivres: 10,
      caixa: { id: 1, nome: 'CX-01', linhas: 10, colunas: 10, gavetaId: 1, criadoEm: '', atualizadoEm: '' },
    };

    render(
      <SugestaoCard
        sugestao={fakeSugestao}
        loading={false}
        onBuscarSugestao={vi.fn()}
        onAplicarSugestao={handleAplicar}
        sugestaoAplicada={false}
      />
    );

    const button = screen.getByRole('button', { name: /usar esta posição/i });
    fireEvent.click(button);

    expect(handleAplicar).toHaveBeenCalledTimes(1);
  });
});
