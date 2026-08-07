'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Table, { Column } from '@/components/ui/Table';
import Badge, { materialVariant } from '@/components/ui/Badge';
import { Amostra, Caixa } from '@/types';
import { amostraService } from '@/services/amostra.service';
import { caixaService } from '@/services/caixa.service';

import AmostraFiltros from '@/components/amostras/AmostraFiltros';
import ImportCSVModal from '@/components/amostras/ImportCSVModal';
import EditAmostraModal from '@/components/amostras/EditAmostraModal';
import ConfirmDeleteModal from '@/components/estrutura/ConfirmDeleteModal';

const ITEMS_PER_PAGE = 7;

// Ícones SVG profissionais
const ImportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
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

export default function AmostrasPage() {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [caixas, setCaixas] = useState<Caixa[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filtros
  const [busca, setBusca] = useState('');
  const [material, setMaterial] = useState('');
  const [caixaId, setCaixaId] = useState('');

  // Modais
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [amostraToEdit, setAmostraToEdit] = useState<Amostra | null>(null);
  const [amostraToDelete, setAmostraToDelete] = useState<Amostra | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Carrega caixas para o select de filtros
  useEffect(() => {
    caixaService.getAll().then(setCaixas).catch(() => []);
  }, []);

  // Carrega amostras com filtros aplicados
  const loadAmostras = useCallback(async () => {
    setLoading(true);
    try {
      const data = await amostraService.getAll({
        busca: busca.trim() || undefined,
        material: material || undefined,
        caixaId: caixaId ? Number(caixaId) : undefined,
      });
      setAmostras(data);
    } catch {
      setAmostras([]);
    } finally {
      setLoading(false);
    }
  }, [busca, material, caixaId]);

  useEffect(() => {
    loadAmostras();
    setPage(1); // Reseta página ao alterar filtros
  }, [loadAmostras]);

  function handleLimparFiltros() {
    setBusca('');
    setMaterial('');
    setCaixaId('');
  }

  // Handler de exclusão
  async function handleDeleteConfirm() {
    if (!amostraToDelete) return;
    setDeleteLoading(true);
    try {
      await amostraService.delete(amostraToDelete.id);
      setAmostraToDelete(null);
      loadAmostras();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir amostra.';
      alert(msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  // Paginação dos dados
  const totalItems = amostras.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedAmostras = amostras.slice(startIndex, endIndex);

  // Colunas da Tabela de Amostras
  const columns: Column<Amostra>[] = [
    {
      key: 'codigoAmostra',
      header: 'Código',
      render: (a) =>
        a.codigoAmostra ? (
          <span className="font-mono text-xs font-semibold text-text-primary bg-neo-lighter px-2 py-1 rounded">
            {a.codigoAmostra}
          </span>
        ) : (
          <span className="text-text-muted italic text-xs">Sem código</span>
        ),
    },
    {
      key: 'pacienteNome',
      header: 'Paciente',
      render: (a) => <span className="font-semibold text-text-primary">{a.pacienteNome}</span>,
    },
    {
      key: 'material',
      header: 'Material',
      render: (a) => (
        <Badge variant={materialVariant(a.material)}>{a.material}</Badge>
      ),
    },
    {
      key: 'concentracaoNgUl',
      header: 'Concentração',
      render: (a) =>
        a.concentracaoNgUl ? (
          <span className="text-xs font-medium text-text-primary">
            {a.concentracaoNgUl} <span className="text-text-muted font-normal">ng/µL</span>
          </span>
        ) : (
          <span className="text-text-muted text-xs">—</span>
        ),
    },
    {
      key: 'exame',
      header: 'Exame',
      render: (a) => (
        <span className="text-xs text-text-muted truncate max-w-[140px] block" title={a.exame ?? undefined}>
          {a.exame ?? '—'}
        </span>
      ),
    },
    {
      key: 'localizacao',
      header: 'Localização Física',
      render: (a) => {
        const c = a.caixa;
        const g = c?.gaveta;
        const f = g?.freezer;
        const s = f?.sala;
        return (
          <div className="flex items-center gap-1 text-xs text-text-muted flex-wrap">
            <span>{s?.nome ?? '—'}</span>
            <span>/</span>
            <span>{f?.nome ?? '—'}</span>
            <span>/</span>
            <span>{g?.nome ?? '—'}</span>
            <span>/</span>
            <span className="font-medium text-text-primary">{c?.nome ?? 'Caixa'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-neo-teal text-white font-bold text-[11px] shadow-sm">
              {a.posicao}
            </span>
          </div>
        );
      },
    },
    {
      key: 'mapa',
      header: 'Grade Visual',
      render: (a) => (
        <Link href={`/caixas/${a.caixaId}/mapa`}>
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <MapIcon /> Ver no Mapa
          </Button>
        </Link>
      ),
    },
    {
      key: 'acoes',
      header: 'Ações',
      width: '100px',
      render: (a) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAmostraToEdit(a)}
            className="p-1.5 text-text-muted hover:text-accent hover:bg-neo-lighter rounded-lg transition-colors"
            title="Editar Amostra"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => setAmostraToDelete(a)}
            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir Amostra"
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
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Gerenciamento de Amostras</h2>
          <p className="text-xs text-text-muted mt-1">
            Consulte, filtre e acompanhe a localização exata de cada microtubo de DNA no laboratório.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
            className="gap-2"
          >
            <ImportIcon /> Importar CSV
          </Button>

          <Link href="/amostras/nova">
            <Button variant="primary" className="gap-2">
              <PlusIcon /> Cadastrar Amostra
            </Button>
          </Link>
        </div>
      </div>

      {/* Barra de Filtros Avançados */}
      <AmostraFiltros
        busca={busca}
        onBuscaChange={setBusca}
        material={material}
        onMaterialChange={setMaterial}
        caixaId={caixaId}
        onCaixaIdChange={setCaixaId}
        caixas={caixas}
        onLimpar={handleLimparFiltros}
      />

      {/* Tabela de Amostras */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between min-h-[550px]">
        <div className="flex-1">
          <Table
            columns={columns}
            data={paginatedAmostras}
            loading={loading}
            emptyMessage="Nenhuma amostra encontrada com os filtros selecionados."
            keyExtractor={(a) => a.id}
          />
        </div>

        {/* Rodapé de Paginação */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <div>
            {totalItems > 0 ? (
              <span>
                Exibindo <strong className="text-text-primary font-semibold">{startIndex + 1}</strong> a{' '}
                <strong className="text-text-primary font-semibold">{endIndex}</strong> de{' '}
                <strong className="text-text-primary font-semibold">{totalItems}</strong> amostras
              </span>
            ) : (
              <span>Nenhuma amostra cadastrada</span>
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

      {/* Modal de Importação CSV */}
      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={loadAmostras}
      />

      {/* Modal de Edição de Amostra */}
      <EditAmostraModal
        isOpen={!!amostraToEdit}
        onClose={() => setAmostraToEdit(null)}
        onSuccess={loadAmostras}
        amostra={amostraToEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={!!amostraToDelete}
        onClose={() => setAmostraToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Excluir Amostra ${amostraToDelete?.codigoAmostra ? `(${amostraToDelete.codigoAmostra})` : ''}`}
        message={`Tem certeza que deseja excluir a amostra do paciente "${amostraToDelete?.pacienteNome}" na posição ${amostraToDelete?.posicao}?`}
        loading={deleteLoading}
      />
    </div>
  );
}
