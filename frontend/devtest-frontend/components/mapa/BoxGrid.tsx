'use client';

import { CelulaMapa } from '@/types';

interface BoxGridProps {
  linhas: number;
  colunas: number;
  grade: CelulaMapa[];
  onSelectCelula: (celula: CelulaMapa) => void;
}

export default function BoxGrid({
  linhas,
  colunas,
  grade,
  onSelectCelula,
}: BoxGridProps) {
  // Converte o array linear da grade em uma matriz [linha][coluna]
  const celulasPorPosicao = new Map<string, CelulaMapa>();
  grade.forEach((c) => celulasPorPosicao.set(c.posicao, c));

  const letrasLinhas = Array.from({ length: linhas }, (_, i) => String.fromCharCode(65 + i));
  const numerosColunas = Array.from({ length: colunas }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto p-4 bg-card rounded-2xl border border-border shadow-sm">
      <div
        className="grid gap-2 min-w-[500px]"
        style={{
          gridTemplateColumns: `40px repeat(${colunas}, minmax(44px, 1fr))`,
        }}
      >
        {/* Célula vazia no canto superior esquerdo */}
        <div className="flex items-center justify-center font-bold text-xs text-text-muted">
          #
        </div>

        {/* Eixo Superior: Números das Colunas (1, 2, 3...) */}
        {numerosColunas.map((col) => (
          <div
            key={`col-head-${col}`}
            className="flex items-center justify-center font-bold text-xs text-text-muted py-1 bg-neo-lighter rounded-lg border border-border/50"
          >
            {col}
          </div>
        ))}

        {/* Linhas da Grade */}
        {letrasLinhas.map((letra) => (
          <div key={`row-group-${letra}`} className="contents">
            {/* Eixo Lateral: Letra da Linha (A, B, C...) */}
            <div className="flex items-center justify-center font-bold text-xs text-neo-darkest bg-neo-lighter rounded-lg border border-border/50">
              {letra}
            </div>

            {/* Células da Linha (A1, A2, A3...) */}
            {numerosColunas.map((col) => {
              const posKey = `${letra}${col}`;
              const celula = celulasPorPosicao.get(posKey) ?? {
                posicao: posKey,
                livre: true,
                amostra: null,
              };

              const ehLivre = celula.livre;
              const amostra = celula.amostra;
              const material = amostra?.material.toLowerCase() ?? '';

              // Definição de cores por tipo de material
              let celulaStyle = 'bg-emerald-50/80 border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-500 shadow-sm';
              if (!ehLivre) {
                if (material.includes('dna')) {
                  celulaStyle = 'bg-neo-dark text-white border-neo-teal hover:bg-neo-teal-dark shadow-md';
                } else if (material.includes('swab')) {
                  celulaStyle = 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-md';
                } else if (material.includes('sangue')) {
                  celulaStyle = 'bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-md';
                } else {
                  celulaStyle = 'bg-slate-700 text-white border-slate-800 hover:bg-slate-800 shadow-md';
                }
              }

              return (
                <div
                  key={posKey}
                  onClick={() => onSelectCelula(celula)}
                  title={
                    amostra
                      ? `Posição ${posKey}: ${amostra.pacienteNome} (${amostra.material})`
                      : `Posição ${posKey}: LIVRE`
                  }
                  className={`
                    relative group h-12 rounded-xl border flex flex-col items-center justify-center
                    cursor-pointer transition-all duration-150 select-none
                    ${celulaStyle}
                  `}
                >
                  {/* Posição da Célula */}
                  <span className="text-[10px] font-mono font-bold opacity-75">
                    {posKey}
                  </span>

                  {/* Indicador de Tubo Ocupado x Livre */}
                  {ehLivre ? (
                    <span className="text-[9px] font-medium text-emerald-600 uppercase">Livre</span>
                  ) : (
                    <span className="text-[10px] font-bold truncate max-w-[38px] px-0.5">
                      {amostra?.pacienteNome.split(' ')[0]}
                    </span>
                  )}

                  {/* Tooltip no Hover para células ocupadas */}
                  {!ehLivre && amostra && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col gap-0.5 bg-neo-darkest text-white text-[11px] p-2 rounded-lg shadow-xl z-30 whitespace-nowrap border border-white/10 pointer-events-none animate-fade-in">
                      <p className="font-bold text-neo-teal">{amostra.pacienteNome}</p>
                      {amostra.codigoAmostra && (
                        <p className="font-mono text-[10px] text-white/70">Cód: {amostra.codigoAmostra}</p>
                      )}
                      <p className="text-[10px] text-white/80">Mat: {amostra.material}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
