'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Table, { Column } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { Sala, Freezer, Gaveta, Caixa } from '@/types';
import { salaService } from '@/services/sala.service';
import { freezerService } from '@/services/freezer.service';
import { gavetaService } from '@/services/gaveta.service';
import { caixaService } from '@/services/caixa.service';

import SalaModal from '@/components/estrutura/SalaModal';
import FreezerModal from '@/components/estrutura/FreezerModal';
import GavetaModal from '@/components/estrutura/GavetaModal';
import CaixaModal from '@/components/estrutura/CaixaModal';
import ConfirmDeleteModal from '@/components/estrutura/ConfirmDeleteModal';

type TabType = 'salas' | 'freezers' | 'gavetas' | 'caixas';
const ITEMS_PER_PAGE = 8;

// Ícones SVG profissionais
const SalaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 7v14M21 7v14M6 21V10h12v11M9 3h6M12 3v4"/>
  </svg>
);

const FreezerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <line x1="5" y1="10" x2="19" y2="10"/>
    <line x1="9" y1="6" x2="9" y2="6.01"/>
    <line x1="9" y1="15" x2="9" y2="15.01"/>
  </svg>
);

const GavetaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="7" rx="2"/>
    <rect x="3" y="13" width="18" height="7" rx="2"/>
    <line x1="10" y1="7.5" x2="14" y2="7.5"/>
    <line x1="10" y1="16.5" x2="14" y2="16.5"/>
  </svg>
);

const CaixaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
  </svg>
);

const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

export default function EstruturaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('salas');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Data states
  const [salas, setSalas] = useState<Sala[]>([]);
  const [freezers, setFreezers] = useState<Freezer[]>([]);
  const [gavetas, setGavetas] = useState<Gaveta[]>([]);
  const [caixas, setCaixas] = useState<Caixa[]>([]);

  // Modals state
  const [isSalaModalOpen, setIsSalaModalOpen] = useState(false);
  const [isFreezerModalOpen, setIsFreezerModalOpen] = useState(false);
  const [isGavetaModalOpen, setIsGavetaModalOpen] = useState(false);
  const [isCaixaModalOpen, setIsCaixaModalOpen] = useState(false);

  // Edit targets
  const [salaToEdit, setSalaToEdit] = useState<Sala | null>(null);
  const [freezerToEdit, setFreezerToEdit] = useState<Freezer | null>(null);
  const [gavetaToEdit, setGavetaToEdit] = useState<Gaveta | null>(null);
  const [caixaToEdit, setCaixaToEdit] = useState<Caixa | null>(null);

  // Delete state
  const [itemToDelete, setItemToDelete] = useState<{
    type: TabType;
    id: number;
    name: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Reseta página ao mudar de tab
  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    setPage(1);
  }

  // Carrega todos os dados da estrutura física
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sData, fData, gData, cData] = await Promise.all([
        salaService.getAll().catch(() => []),
        freezerService.getAll().catch(() => []),
        gavetaService.getAll().catch(() => []),
        caixaService.getAll().catch(() => []),
      ]);

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
    loadData();
  }, [loadData]);

  // Handler para exclusão
  async function handleDeleteConfirm() {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      if (itemToDelete.type === 'salas') await salaService.delete(itemToDelete.id);
      if (itemToDelete.type === 'freezers') await freezerService.delete(itemToDelete.id);
      if (itemToDelete.type === 'gavetas') await gavetaService.delete(itemToDelete.id);
      if (itemToDelete.type === 'caixas') await caixaService.delete(itemToDelete.id);

      setItemToDelete(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir item.';
      alert(msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  // Obter lista atual com base na tab
  function getCurrentListData() {
    switch (activeTab) {
      case 'salas': return salas;
      case 'freezers': return freezers;
      case 'gavetas': return gavetas;
      case 'caixas': return caixas;
    }
  }

  const currentList = getCurrentListData();
  const totalItems = currentList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  // Paginação dos dados
  const paginatedSalas = salas.slice(startIndex, endIndex);
  const paginatedFreezers = freezers.slice(startIndex, endIndex);
  const paginatedGavetas = gavetas.slice(startIndex, endIndex);
  const paginatedCaixas = caixas.slice(startIndex, endIndex);

  // Colunas da tabela de SALAS
  const salaColumns: Column<Sala>[] = [
    { key: 'nome', header: 'Nome da Sala', render: (s) => <span className="font-semibold">{s.nome}</span> },
    {
      key: 'freezers',
      header: 'Total de Freezers',
      render: (s) => (
        <Badge variant="teal">
          {s._count?.freezers ?? s.freezers?.length ?? 0} freezers
        </Badge>
      ),
    },
    {
      key: 'criadoEm',
      header: 'Criado em',
      render: (s) => new Date(s.criadoEm).toLocaleDateString('pt-BR'),
    },
    {
      key: 'acoes',
      header: 'Ações',
      width: '120px',
      render: (s) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSalaToEdit(s); setIsSalaModalOpen(true); }}
            className="p-1.5 text-text-muted hover:text-accent hover:bg-neo-lighter rounded-lg transition-colors"
            title="Editar"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => setItemToDelete({ type: 'salas', id: s.id, name: s.nome })}
            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  // Colunas da tabela de FREEZERS
  const freezerColumns: Column<Freezer>[] = [
    { key: 'nome', header: 'Nome do Freezer', render: (f) => <span className="font-semibold">{f.nome}</span> },
    {
      key: 'sala',
      header: 'Sala Pertencente',
      render: (f) => <Badge variant="blue">{f.sala?.nome ?? 'Sem sala'}</Badge>,
    },
    {
      key: 'maxGavetas',
      header: 'Capacidade Max.',
      render: (f) => f.maxGavetas ? `${f.maxGavetas} gavetas` : <span className="text-text-muted">Ilimitada</span>,
    },
    {
      key: 'gavetas',
      header: 'Total de Gavetas',
      render: (f) => (
        <Badge variant="teal">
          {f._count?.gavetas ?? f.gavetas?.length ?? 0} gavetas
        </Badge>
      ),
    },
    {
      key: 'acoes',
      header: 'Ações',
      width: '120px',
      render: (f) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setFreezerToEdit(f); setIsFreezerModalOpen(true); }}
            className="p-1.5 text-text-muted hover:text-accent hover:bg-neo-lighter rounded-lg transition-colors"
            title="Editar"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => setItemToDelete({ type: 'freezers', id: f.id, name: f.nome })}
            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  // Colunas da tabela de GAVETAS
  const gavetaColumns: Column<Gaveta>[] = [
    { key: 'nome', header: 'Nome da Gaveta', render: (g) => <span className="font-semibold">{g.nome}</span> },
    {
      key: 'freezer',
      header: 'Caminho (Freezer → Sala)',
      render: (g) => (
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Badge variant="blue">{g.freezer?.nome ?? 'Sem freezer'}</Badge>
          <span>→</span>
          <Badge variant="gray">{g.freezer?.sala?.nome ?? '—'}</Badge>
        </div>
      ),
    },
    {
      key: 'maxCaixas',
      header: 'Capacidade Max.',
      render: (g) => g.maxCaixas ? `${g.maxCaixas} caixas` : <span className="text-text-muted">Ilimitada</span>,
    },
    {
      key: 'caixas',
      header: 'Total de Caixas',
      render: (g) => (
        <Badge variant="teal">
          {g._count?.caixas ?? g.caixas?.length ?? 0} caixas
        </Badge>
      ),
    },
    {
      key: 'acoes',
      header: 'Ações',
      width: '120px',
      render: (g) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setGavetaToEdit(g); setIsGavetaModalOpen(true); }}
            className="p-1.5 text-text-muted hover:text-accent hover:bg-neo-lighter rounded-lg transition-colors"
            title="Editar"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => setItemToDelete({ type: 'gavetas', id: g.id, name: g.nome })}
            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  // Colunas da tabela de CAIXAS
  const caixaColumns: Column<Caixa>[] = [
    { key: 'nome', header: 'Nome da Caixa', render: (c) => <span className="font-semibold">{c.nome}</span> },
    {
      key: 'caminho',
      header: 'Caminho Físico',
      render: (c) => (
        <span className="text-xs text-text-muted font-medium">
          {c.gaveta?.freezer?.sala?.nome ?? '—'} / {c.gaveta?.freezer?.nome ?? '—'} / {c.gaveta?.nome ?? '—'}
        </span>
      ),
    },
    {
      key: 'dimensao',
      header: 'Grade / Posições',
      render: (c) => (
        <Badge variant="teal">
          {c.linhas}×{c.colunas} ({c.linhas * c.colunas} posições)
        </Badge>
      ),
    },
    {
      key: 'mapa',
      header: 'Grade Visual',
      render: (c) => (
        <Link href={`/caixas/${c.id}/mapa`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MapIcon /> Ver Mapa
          </Button>
        </Link>
      ),
    },
    {
      key: 'acoes',
      header: 'Ações',
      width: '120px',
      render: (c) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCaixaToEdit(c); setIsCaixaModalOpen(true); }}
            className="p-1.5 text-text-muted hover:text-accent hover:bg-neo-lighter rounded-lg transition-colors"
            title="Editar"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => setItemToDelete({ type: 'caixas', id: c.id, name: c.nome })}
            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Estrutura Física do Laboratório</h2>
          <p className="text-xs text-text-muted mt-1">
            Gerencie as Salas, Freezers, Gavetas e Caixas onde os microtubos de DNA são armazenados.
          </p>
        </div>

        <div>
          {activeTab === 'salas' && (
            <Button
              variant="primary"
              onClick={() => { setSalaToEdit(null); setIsSalaModalOpen(true); }}
            >
              + Nova Sala
            </Button>
          )}
          {activeTab === 'freezers' && (
            <Button
              variant="primary"
              onClick={() => { setFreezerToEdit(null); setIsFreezerModalOpen(true); }}
            >
              + Novo Freezer
            </Button>
          )}
          {activeTab === 'gavetas' && (
            <Button
              variant="primary"
              onClick={() => { setGavetaToEdit(null); setIsGavetaModalOpen(true); }}
            >
              + Nova Gaveta
            </Button>
          )}
          {activeTab === 'caixas' && (
            <Button
              variant="primary"
              onClick={() => { setCaixaToEdit(null); setIsCaixaModalOpen(true); }}
            >
              + Nova Caixa
            </Button>
          )}
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => handleTabChange('salas')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
            activeTab === 'salas'
              ? 'bg-neo-dark text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-neo-lighter'
          }`}
        >
          <SalaIcon /> Salas <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{salas.length}</span>
        </button>

        <button
          onClick={() => handleTabChange('freezers')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
            activeTab === 'freezers'
              ? 'bg-neo-dark text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-neo-lighter'
          }`}
        >
          <FreezerIcon /> Freezers <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{freezers.length}</span>
        </button>

        <button
          onClick={() => handleTabChange('gavetas')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
            activeTab === 'gavetas'
              ? 'bg-neo-dark text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-neo-lighter'
          }`}
        >
          <GavetaIcon /> Gavetas <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{gavetas.length}</span>
        </button>

        <button
          onClick={() => handleTabChange('caixas')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
            activeTab === 'caixas'
              ? 'bg-neo-dark text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-neo-lighter'
          }`}
        >
          <CaixaIcon /> Caixas <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{caixas.length}</span>
        </button>
      </div>

      {/* Conteúdo da Tab Ativa */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between">
        <div className="flex-1">
          {activeTab === 'salas' && (
            <Table
              columns={salaColumns}
              data={paginatedSalas}
              loading={loading}
              emptyMessage="Nenhuma sala cadastrada no sistema."
              keyExtractor={(s) => s.id}
            />
          )}

          {activeTab === 'freezers' && (
            <Table
              columns={freezerColumns}
              data={paginatedFreezers}
              loading={loading}
              emptyMessage="Nenhum freezer cadastrado no sistema."
              keyExtractor={(f) => f.id}
            />
          )}

          {activeTab === 'gavetas' && (
            <Table
              columns={gavetaColumns}
              data={paginatedGavetas}
              loading={loading}
              emptyMessage="Nenhuma gaveta cadastrada no sistema."
              keyExtractor={(g) => g.id}
            />
          )}

          {activeTab === 'caixas' && (
            <Table
              columns={caixaColumns}
              data={paginatedCaixas}
              loading={loading}
              emptyMessage="Nenhuma caixa cadastrada no sistema."
              keyExtractor={(c) => c.id}
            />
          )}
        </div>

        {/* Rodapé de Paginação Fixo */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <div>
            {totalItems > 0 ? (
              <span>
                Exibindo <strong className="text-text-primary font-semibold">{startIndex + 1}</strong> a{' '}
                <strong className="text-text-primary font-semibold">{endIndex}</strong> de{' '}
                <strong className="text-text-primary font-semibold">{totalItems}</strong> registros
              </span>
            ) : (
              <span>Nenhum registro encontrado</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Anterior
            </Button>

            <span className="px-3 py-1 bg-neo-lighter rounded-lg font-medium text-text-primary">
              Página {page} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Próximo ›
            </Button>
          </div>
        </div>
      </div>

      {/* Modais de Cadastro/Edição */}
      <SalaModal
        isOpen={isSalaModalOpen}
        onClose={() => { setIsSalaModalOpen(false); setSalaToEdit(null); }}
        onSuccess={loadData}
        salaToEdit={salaToEdit}
      />

      <FreezerModal
        isOpen={isFreezerModalOpen}
        onClose={() => { setIsFreezerModalOpen(false); setFreezerToEdit(null); }}
        onSuccess={loadData}
        freezerToEdit={freezerToEdit}
        salas={salas}
      />

      <GavetaModal
        isOpen={isGavetaModalOpen}
        onClose={() => { setIsGavetaModalOpen(false); setGavetaToEdit(null); }}
        onSuccess={loadData}
        gavetaToEdit={gavetaToEdit}
        freezers={freezers}
      />

      <CaixaModal
        isOpen={isCaixaModalOpen}
        onClose={() => { setIsCaixaModalOpen(false); setCaixaToEdit(null); }}
        onSuccess={loadData}
        caixaToEdit={caixaToEdit}
        gavetas={gavetas}
      />

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Excluir ${itemToDelete?.name}`}
        message={`Tem certeza que deseja excluir "${itemToDelete?.name}"? Esta ação excluirá permanentemente os itens dependentes nesta hierarquia.`}
        loading={deleteLoading}
      />
    </div>
  );
}
