'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Caixa } from '@/types';

interface AmostraFiltrosProps {
  busca: string;
  onBuscaChange: (v: string) => void;
  material: string;
  onMaterialChange: (v: string) => void;
  caixaId: string;
  onCaixaIdChange: (v: string) => void;
  caixas: Caixa[];
  onLimpar: () => void;
}

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FilterResetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

export default function AmostraFiltros({
  busca,
  onBuscaChange,
  material,
  onMaterialChange,
  caixaId,
  onCaixaIdChange,
  caixas,
  onLimpar,
}: AmostraFiltrosProps) {
  const temFiltroAtivo = Boolean(busca || material || caixaId);

  const materialOptions = [
    { value: '', label: 'Todos os materiais' },
    { value: 'DNA', label: 'DNA' },
    { value: 'Swab bucal', label: 'Swab Bucal' },
    { value: 'Sangue total', label: 'Sangue Total' },
    { value: 'Outros', label: 'Outros' },
  ];

  const caixaOptions = [
    { value: '', label: 'Todas as caixas' },
    ...caixas.map((c) => ({
      value: String(c.id),
      label: c.nome,
    })),
  ];

  return (
    <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-stretch md:items-end gap-3">
      {/* Busca por código ou paciente */}
      <div className="flex-1">
        <Input
          label="Buscar por Código ou Paciente"
          placeholder="Ex: A01001000..., Ana Silva..."
          leftIcon={<SearchIcon />}
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
        />
      </div>

      {/* Filtro de Material */}
      <div className="w-full md:w-48">
        <Select
          label="Tipo de Material"
          options={materialOptions}
          value={material}
          onChange={(e) => onMaterialChange(e.target.value)}
        />
      </div>

      {/* Filtro de Caixa */}
      <div className="w-full md:w-56">
        <Select
          label="Caixa Específica"
          options={caixaOptions}
          value={caixaId}
          onChange={(e) => onCaixaIdChange(e.target.value)}
        />
      </div>

      {/* Botão de Limpar Filtros */}
      {temFiltroAtivo && (
        <Button
          variant="outline"
          onClick={onLimpar}
          className="h-[38px] gap-1.5 text-xs self-end"
        >
          <FilterResetIcon /> Limpar
        </Button>
      )}
    </div>
  );
}
