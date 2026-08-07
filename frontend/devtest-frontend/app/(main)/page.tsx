'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';
import Badge, { materialVariant } from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';

import { Amostra, Sala, Freezer, Gaveta, Caixa } from '@/types';
import { amostraService } from '@/services/amostra.service';
import { salaService } from '@/services/sala.service';
import { freezerService } from '@/services/freezer.service';
import { gavetaService } from '@/services/gaveta.service';
import { caixaService } from '@/services/caixa.service';
import { useAuth } from '@/contexts/AuthContext';

// Ícones SVG profissionais
const DNAIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 15c6.667-6 13.333 0 20-6"/>
    <path d="M2 9c6.667 6 13.333 0 20 6"/>
    <line x1="7" y1="11.5" x2="7" y2="12.5"/>
    <line x1="12" y1="9" x2="12" y2="15"/>
    <line x1="17" y1="11.5" x2="17" y2="12.5"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="9" y1="6" x2="9" y2="6.01"/>
    <line x1="15" y1="6" x2="15" y2="6.01"/>
    <line x1="9" y1="10" x2="9" y2="10.01"/>
    <line x1="15" y1="10" x2="15" y2="10.01"/>
    <line x1="9" y1="14" x2="9" y2="14.01"/>
    <line x1="15" y1="14" x2="15" y2="14.01"/>
  </svg>
);

const FreezerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <line x1="5" y1="10" x2="19" y2="10"/>
    <line x1="9" y1="6" x2="9" y2="6.01"/>
    <line x1="9" y1="15" x2="9" y2="15.01"/>
  </svg>
);

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(true);

  // Estados de dados do Dashboard
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [freezers, setFreezers] = useState<Freezer[]>([]);
  const [gavetas, setGavetas] = useState<Gaveta[]>([]);
  const [caixas, setCaixas] = useState<Caixa[]>([]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [aData, sData, fData, gData, cData] = await Promise.all([
        amostraService.getAll().catch(() => []),
        salaService.getAll().catch(() => []),
        freezerService.getAll().catch(() => []),
        gavetaService.getAll().catch(() => []),
        caixaService.getAll().catch(() => []),
      ]);

      setAmostras(aData);
      setSalas(sData);
      setFreezers(fData);
      setGavetas(gData);
      setCaixas(cData);
    } catch {
      // Ignora erro
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loading text="Carregando métricas do dashboard..." size="lg" />
      </div>
    );
  }

  // Cálculos de métricas
  const totalAmostras = amostras.length;
  const totalSalas = salas.length;
  const totalFreezers = freezers.length;
  const totalGavetas = gavetas.length;
  const totalCaixas = caixas.length;

  // Cálculo da capacidade total de posições físicas nas caixas
  const capacidadeTotalPosicoes = caixas.reduce(
    (acc, c) => acc + c.linhas * c.colunas,
    0
  );
  const vagasLivres = Math.max(0, capacidadeTotalPosicoes - totalAmostras);
  const taxaOcupacaoGeral = capacidadeTotalPosicoes > 0
    ? Math.round((totalAmostras / capacidadeTotalPosicoes) * 100)
    : 0;

  // Distribuição por tipo de material
  const contagemMateriais = amostras.reduce((acc, a) => {
    const mat = a.material || 'Outros';
    acc[mat] = (acc[mat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 5 Amostras mais recentes
  const amostrasRecentes = [...amostras].slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner de Boas-Vindas e Atalhos Rápidos */}
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider px-1 py-1 rounded-full inline-block mb-3">
            Visão Geral do Laboratório
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
            Bem-vindo de volta, {usuario?.nome ?? 'Pesquisador'}!
          </h2>
          <p className="text-xs md:text-sm text-text-muted mt-1.5 max-w-xl leading-relaxed">
            Acompanhe o estoque de microtubos de DNA, taxa de ocupação dos freezers e utilize o First-Fit para novas alocações.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/amostras/nova">
            <Button variant="primary" size="md" className="gap-2 shadow-md shadow-accent/20">
              <PlusIcon /> Cadastrar Amostra
            </Button>
          </Link>
          <Link href="/estrutura">
            <Button variant="outline" size="md">
              Gerenciar Estrutura
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de StatCards (Métricas Globais) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Amostras"
          value={totalAmostras}
          subtitle="Microtubos cadastrados"
          icon={<DNAIcon />}
        />

        <StatCard
          title="Salas & Unidades"
          value={totalSalas}
          subtitle={`${totalFreezers} freezers cadastrados`}
          icon={<BuildingIcon />}
        />

        <StatCard
          title="Gavetas & Caixas"
          value={`${totalGavetas} / ${totalCaixas}`}
          subtitle="Gavetas e caixas ativas"
          icon={<FreezerIcon />}
        />

        <StatCard
          title="Taxa de Ocupação Laboratorial"
          value={`${taxaOcupacaoGeral}%`}
          subtitle={`${vagasLivres} vagas livres de ${capacidadeTotalPosicoes}`}
          icon={<BoxIcon />}
          accent
        />
      </div>

      {/* Duas Colunas: Distribuição de Materiais e Últimas Amostras */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUNA ESQUERDA: Distribuição por Tipo de Material */}
        <div className="lg:col-span-4 bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">Distribuição por Material</h3>
            <p className="text-xs text-text-muted mt-0.5">Proporção dos microtubos armazenados</p>
          </div>

          <div className="space-y-3.5">
            {Object.keys(contagemMateriais).length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">Nenhuma amostra cadastrada.</p>
            ) : (
              Object.entries(contagemMateriais).map(([mat, qtd]) => {
                const pct = totalAmostras > 0 ? Math.round((qtd / totalAmostras) * 100) : 0;
                return (
                  <div key={mat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant={materialVariant(mat)}>{mat}</Badge>
                        <span className="font-semibold text-text-primary">{qtd} tubos</span>
                      </div>
                      <span className="font-bold text-text-muted">{pct}%</span>
                    </div>

                    {/* Barra visual de porcentagem */}
                    <div className="w-full h-2 bg-neo-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neo-teal rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Dica de Idempotência do Sistema */}
          <div className="p-3 rounded-xl bg-neo-lighter border border-border text-[11px] text-text-muted leading-relaxed">
            <strong>Dica de Uso:</strong> Use o botão <strong>"Importar CSV"</strong> na página de Amostras para popular dados em lote sem duplicar registros.
          </div>
        </div>

        {/* ── COLUNA DIREITA: Tabela de Amostras Recentes ── */}
        <div className="lg:col-span-8 bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary tracking-tight">Últimas Amostras Cadastradas</h3>
              <p className="text-xs text-text-muted mt-0.5">Microtubos adicionados recentemente</p>
            </div>

            <Link href="/amostras">
              <Button variant="ghost" size="sm" className="text-xs">
                Ver Todas ({totalAmostras}) ›
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-neo-lighter border-b border-border text-text-muted font-semibold uppercase">
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Caixa / Posição</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {amostrasRecentes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-text-muted">
                      Nenhuma amostra encontrada.
                    </td>
                  </tr>
                ) : (
                  amostrasRecentes.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-border last:border-0 hover:bg-neo-lighter/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-text-primary">
                        {a.codigoAmostra ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-text-primary">
                        {a.pacienteNome}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={materialVariant(a.material)}>{a.material}</Badge>
                      </td>
                      <td className="px-4 py-3 text-text-muted font-medium">
                        {a.caixa?.nome ?? 'Caixa'} <span className="font-bold text-neo-teal font-mono">[{a.posicao}]</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/caixas/${a.caixaId}/mapa`}>
                          <Button variant="outline" size="sm" className="gap-1 text-[11px] py-1">
                            <MapIcon /> Mapa
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-right">
            <Link href="/amostras">
              <span className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                Ir para a listagem completa de amostras →
              </span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
