'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Caixa, Gaveta } from '@/types';
import { caixaService } from '@/services/caixa.service';

interface CaixaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  caixaToEdit?: Caixa | null;
  gavetas: Gaveta[];
}

export default function CaixaModal({
  isOpen,
  onClose,
  onSuccess,
  caixaToEdit,
  gavetas,
}: CaixaModalProps) {
  const [nome, setNome] = useState('');
  const [gavetaId, setGavetaId] = useState<number | ''>('');
  const [linhas, setLinhas] = useState<number>(10);
  const [colunas, setColunas] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (caixaToEdit) {
      setNome(caixaToEdit.nome);
      setGavetaId(caixaToEdit.gavetaId);
      setLinhas(caixaToEdit.linhas);
      setColunas(caixaToEdit.colunas);
    } else {
      setNome('');
      setGavetaId(gavetas.length > 0 ? gavetas[0].id : '');
      setLinhas(10);
      setColunas(10);
    }
    setError(null);
  }, [caixaToEdit, isOpen, gavetas]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome da caixa é obrigatório.');
      return;
    }
    if (!gavetaId) {
      setError('Selecione uma gaveta.');
      return;
    }
    if (linhas < 1 || colunas < 1) {
      setError('Linhas e colunas devem ser maiores que 0.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (caixaToEdit) {
        await caixaService.update(caixaToEdit.id, {
          nome: nome.trim(),
          gavetaId: Number(gavetaId),
        });
      } else {
        await caixaService.create({
          nome: nome.trim(),
          gavetaId: Number(gavetaId),
          linhas: Number(linhas),
          colunas: Number(colunas),
        });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar caixa.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const gavetaOptions = gavetas.map((g) => ({
    value: g.id,
    label: `${g.nome} ${g.freezer ? `(${g.freezer.nome})` : ''}`,
  }));

  const totalPosicoes = linhas * colunas;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={caixaToEdit ? 'Editar Caixa' : 'Nova Caixa'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {caixaToEdit ? 'Salvar Alterações' : 'Criar Caixa'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <Input
          label="Nome da Caixa"
          placeholder="Ex: CONTROLE INTERNO, CX-EXTRAÇÃO 01..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Gaveta Pertencente"
          options={gavetaOptions}
          placeholder="Selecione a gaveta..."
          value={gavetaId}
          onChange={(e) => setGavetaId(Number(e.target.value))}
          required
        />

        {!caixaToEdit ? (
          <div className="grid grid-cols-2 gap-3 bg-neo-lighter/60 p-3 rounded-lg border border-border">
            <Input
              label="Nº de Linhas (A-Z)"
              type="number"
              min="1"
              max="26"
              value={linhas}
              onChange={(e) => setLinhas(Number(e.target.value))}
              required
            />
            <Input
              label="Nº de Colunas (1-N)"
              type="number"
              min="1"
              max="50"
              value={colunas}
              onChange={(e) => setColunas(Number(e.target.value))}
              required
            />
            <div className="col-span-2 text-xs text-text-muted flex justify-between items-center pt-1 border-t border-border/50">
              <span>Capacidade total da grade:</span>
              <span className="font-bold text-accent">{totalPosicoes} posições</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-neo-lighter border border-border text-xs text-text-muted flex justify-between">
            <span>Dimensões da caixa:</span>
            <span className="font-semibold text-text-primary">
              {linhas} linhas × {colunas} colunas ({linhas * colunas} posições)
            </span>
          </div>
        )}
      </form>
    </Modal>
  );
}
