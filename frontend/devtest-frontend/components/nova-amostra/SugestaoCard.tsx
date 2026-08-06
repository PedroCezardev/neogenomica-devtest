'use client';

import { SugestaoResponse } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface SugestaoCardProps {
  sugestao: SugestaoResponse | null;
  loading: boolean;
  onBuscarSugestao: () => void;
  onAplicarSugestao: () => void;
  sugestaoAplicada: boolean;
}

const RobotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function SugestaoCard({
  sugestao,
  loading,
  onBuscarSugestao,
  onAplicarSugestao,
  sugestaoAplicada,
}: SugestaoCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-5 animate-fade-in">
      {/* Header do Card */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neo-lighter flex items-center justify-center text-accent">
            <RobotIcon />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Sugestão Automática (First-Fit)</h3>
            <p className="text-xs text-text-muted">Busca determinística da primeira vaga livre</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onBuscarSugestao}
          loading={loading}
          className="text-xs"
        >
          {sugestao ? 'Recalcular' : 'Buscar Posição'}
        </Button>
      </div>

      {/* Conteúdo da Sugestão */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-8 h-8 border-2 border-neo-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-text-muted">Analisando freezers e caixas do laboratório...</p>
        </div>
      ) : !sugestao ? (
        <div className="py-6 px-4 bg-neo-lighter/40 rounded-xl border border-dashed border-border text-center space-y-2">
          <p className="text-xs font-semibold text-text-primary">Nenhuma posição calculada ainda</p>
          <p className="text-xs text-text-muted max-w-xs mx-auto">
            Clique no botão acima para o sistema analisar as caixas existentes e sugerir a posição ideal automaticamente.
          </p>
        </div>
      ) : sugestao.encontrou ? (
        <div className="space-y-4 animate-scale-in">
          {/* Card com o resultado encontrado */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-neo-light/60 to-neo-lighter border border-neo-teal/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neo-teal-dark uppercase tracking-wider">
                Vaga Livre Encontrada
              </span>
              <Badge variant="teal">{sugestao.totalLivres} vagas restantes</Badge>
            </div>

            {/* Posição em Destaque */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-neo-darkest font-mono bg-card px-3 py-1 rounded-xl shadow-sm border border-border">
                {sugestao.posicao}
              </span>
              <div>
                <p className="text-sm font-bold text-text-primary">{sugestao.caixa.nome}</p>
                <p className="text-xs text-text-muted">Grade {sugestao.caixa.linhas}×{sugestao.caixa.colunas}</p>
              </div>
            </div>

            {/* Caminho Físico Completo, requisito 3 */}
            <div className="pt-2 border-t border-neo-teal/20">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">
                Caminho Físico Completo:
              </p>
              <div className="p-2.5 rounded-lg bg-card border border-border/80 font-mono text-xs text-neo-darkest font-medium overflow-x-auto">
                {sugestao.caminho}
              </div>
            </div>
          </div>

          {/* Botão de Aceitar/Aplicar */}
          <Button
            variant={sugestaoAplicada ? 'secondary' : 'primary'}
            size="md"
            onClick={onAplicarSugestao}
            className="w-full justify-center gap-2"
          >
            {sugestaoAplicada ? (
              <>
                <CheckCircleIcon /> Sugestão Aplicada ao Formulário
              </>
            ) : (
              'Usar Esta Posição'
            )}
          </Button>
        </div>
      ) : (
        /* Caso NÃO haja vagas (Caixas cheias) */
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon />
            <div>
              <h4 className="text-xs font-bold text-amber-800">Todas as Caixas Estão Cheias!</h4>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">{sugestao.mensagem}</p>
            </div>
          </div>

          {sugestao.sugestaoGaveta && (
            <div className="pt-2 border-t border-amber-200/80 text-xs text-amber-900">
              💡 <strong>Sugestão de Expansão:</strong> Crie uma nova caixa na gaveta{' '}
              <strong>"{sugestao.sugestaoGaveta.nome}"</strong> do freezer{' '}
              <strong>"{sugestao.sugestaoGaveta.freezer?.nome}"</strong>.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
