'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Amostra } from '@/types';
import { amostraService } from '@/services/amostra.service';

interface EditAmostraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amostra: Amostra | null;
}

export default function EditAmostraModal({
  isOpen,
  onClose,
  onSuccess,
  amostra,
}: EditAmostraModalProps) {
  const [codigoAmostra, setCodigoAmostra] = useState('');
  const [pacienteNome, setPacienteNome] = useState('');
  const [material, setMaterial] = useState('DNA');
  const [concentracao, setConcentracao] = useState('');
  const [exame, setExame] = useState('');
  const [observacao, setObservacao] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (amostra) {
      setCodigoAmostra(amostra.codigoAmostra ?? '');
      setPacienteNome(amostra.pacienteNome);
      setMaterial(amostra.material);
      setConcentracao(amostra.concentracaoNgUl ? String(amostra.concentracaoNgUl) : '');
      setExame(amostra.exame ?? '');
      setObservacao(amostra.observacao ?? '');
    }
    setError(null);
  }, [amostra, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amostra) return;
    if (!pacienteNome.trim()) {
      setError('O nome do paciente é obrigatório.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await amostraService.update(amostra.id, {
        codigoAmostra: codigoAmostra.trim() || null,
        pacienteNome: pacienteNome.trim(),
        material: material.trim(),
        concentracaoNgUl: concentracao ? Number(concentracao) : null,
        exame: exame.trim() || null,
        observacao: observacao.trim() || null,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar amostra.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const materialOptions = [
    { value: 'DNA', label: 'DNA' },
    { value: 'Swab bucal', label: 'Swab Bucal' },
    { value: 'Sangue total', label: 'Sangue Total' },
    { value: 'Outros', label: 'Outros' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Amostra"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Salvar Alterações
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

        {amostra && (
          <div className="p-3 rounded-lg bg-neo-lighter border border-border text-xs text-text-muted flex justify-between items-center">
            <span>Localização física:</span>
            <span className="font-semibold text-text-primary">
              {amostra.caixa?.nome ?? 'Caixa'} — Posição {amostra.posicao}
            </span>
          </div>
        )}

        <Input
          label="Nome do Paciente"
          placeholder="Ex: Ana Silva, João Souza..."
          value={pacienteNome}
          onChange={(e) => setPacienteNome(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Código da Amostra"
            placeholder="Ex: A0100100049801"
            value={codigoAmostra}
            onChange={(e) => setCodigoAmostra(e.target.value)}
          />

          <Select
            label="Material"
            options={materialOptions}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Concentração (ng/µL)"
            type="number"
            step="0.1"
            placeholder="Ex: 52.8"
            value={concentracao}
            onChange={(e) => setConcentracao(e.target.value)}
          />

          <Input
            label="Exame"
            placeholder="Ex: CONTROLE INTERNO"
            value={exame}
            onChange={(e) => setExame(e.target.value)}
          />
        </div>

        <Input
          label="Observação"
          placeholder="Observações de bancada..."
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />
      </form>
    </Modal>
  );
}
