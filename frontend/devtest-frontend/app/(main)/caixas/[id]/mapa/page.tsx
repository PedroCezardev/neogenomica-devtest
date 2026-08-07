'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import BoxGrid from '@/components/mapa/BoxGrid';
import AmostraDetailModal from '@/components/mapa/AmostraDetailModal';
import { MapaCaixa, CelulaMapa } from '@/types';
import { caixaService } from '@/services/caixa.service';

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function MapaCaixaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const caixaId = Number(resolvedParams.id);

  const [mapaData, setMapaData] = useState<MapaCaixa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCelula, setSelectedCelula] = useState<CelulaMapa | null>(null);

  const loadMapa = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await caixaService.getMapa(caixaId);
      setMapaData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar o mapa da caixa.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [caixaId]);

  useEffect(() => {
    loadMapa();
  }, [loadMapa]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loading text="Carregando mapa visual da caixa..." size="lg" />
      </div>
    );
  }

  if (error || !mapaData) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border border-border space-y-4 max-w-md mx-auto mt-12">
        <p className="text-sm font-semibold text-red-600">{error || 'Caixa não encontrada.'}</p>
        <Link href="/estrutura">
          <Button variant="outline">Voltar para a Estrutura</Button>
        </Link>
      </div>
    );
  }

  const { caixa, caminho, resumo, grade } = mapaData;

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/amostras">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeftIcon /> Voltar para Amostras
            </Button>
          </Link>
          <Link href="/estrutura">
            <Button variant="ghost" size="sm">
              Ver na Estrutura Física
            </Button>
          </Link>
        </div>
      </div>

      {/* Card Principal de Título e Localização */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-neo-teal text-white font-mono font-bold text-xs">
              {caixa.linhas}×{caixa.colunas}
            </span>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">{caixa.nome}</h2>
          </div>
          <p className="text-xs text-text-muted mt-2 font-mono">
            <strong>Localização:</strong> {caminho}
          </p>
        </div>

        {/* Heatmap / Barra de Ocupação */}
        <div className="w-full md:w-64 bg-neo-lighter p-3.5 rounded-xl border border-border space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-text-muted">Taxa de Ocupação</span>
            <span className="text-text-primary">{resumo.percentualOcupado}%</span>
          </div>
          <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                resumo.percentualOcupado > 85
                  ? 'bg-red-500'
                  : resumo.percentualOcupado > 60
                  ? 'bg-amber-500'
                  : 'bg-neo-teal'
              }`}
              style={{ width: `${resumo.percentualOcupado}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-muted">Capacidade Total</p>
            <p className="text-2xl font-extrabold text-text-primary mt-0.5">{resumo.totalPosicoes}</p>
          </div>
          <span className="text-xs font-mono font-bold text-text-muted bg-neo-lighter px-2.5 py-1 rounded-lg">
            {caixa.linhas}L × {caixa.colunas}C
          </span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neo-teal-dark">Posições Ocupadas</p>
            <p className="text-2xl font-extrabold text-neo-darkest mt-0.5">{resumo.posicoesOcupadas}</p>
          </div>
          <span className="text-xs font-bold text-neo-teal bg-neo-light px-2.5 py-1 rounded-lg">
            {resumo.percentualOcupado}% cheio
          </span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Vagas Livres</p>
            <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">{resumo.posicoesLivres}</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            Disponíveis
          </span>
        </div>
      </div>

      {/* Legenda de Cores da Grade */}
      <div className="bg-card p-3 px-5 rounded-xl border border-border shadow-sm flex items-center justify-between flex-wrap gap-4 text-xs font-medium">
        <span className="text-text-muted font-semibold">Legenda da Grade:</span>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-400" />
            <span>Livre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-neo-dark border border-neo-teal" />
            <span>DNA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 border border-blue-700" />
            <span>Swab Bucal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-red-600 border border-red-700" />
            <span>Sangue Total</span>
          </div>
        </div>
      </div>

      {/* Grade Visual da Caixa */}
      <BoxGrid
        linhas={caixa.linhas}
        colunas={caixa.colunas}
        grade={grade}
        onSelectCelula={(celula) => {
          if (!celula.livre) {
            setSelectedCelula(celula);
          }
        }}
      />

      {/* Modal de Detalhes da Amostra */}
      <AmostraDetailModal
        isOpen={!!selectedCelula}
        onClose={() => setSelectedCelula(null)}
        celula={selectedCelula}
        caminhoCaixa={caminho}
      />
    </div>
  );
}
