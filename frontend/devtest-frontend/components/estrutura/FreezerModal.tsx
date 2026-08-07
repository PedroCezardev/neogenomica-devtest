'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Freezer, Sala } from '@/types';
import { freezerService } from '@/services/freezer.service';

interface FreezerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  freezerToEdit?: Freezer | null;
  salas: Sala[];
}

export default function FreezerModal({
  isOpen,
  onClose,
  onSuccess,
  freezerToEdit,
  salas,
}: FreezerModalProps) {
  const [nome, setNome] = useState('');
  const [salaId, setSalaId] = useState<number | ''>('');
  const [maxGavetas, setMaxGavetas] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (freezerToEdit) {
      setNome(freezerToEdit.nome);
      setSalaId(freezerToEdit.salaId);
      setMaxGavetas(freezerToEdit.maxGavetas ? String(freezerToEdit.maxGavetas) : '');
    } else {
      setNome('');
      setSalaId(salas.length > 0 ? salas[0].id : '');
      setMaxGavetas('');
    }
    setError(null);
  }, [freezerToEdit, isOpen, salas]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome do freezer é obrigatório.');
      return;
    }
    if (!salaId) {
      setError('Selecione uma sala.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      nome: nome.trim(),
      salaId: Number(salaId),
      maxGavetas: maxGavetas ? Number(maxGavetas) : undefined,
    };

    try {
      if (freezerToEdit) {
        await freezerService.update(freezerToEdit.id, payload);
      } else {
        await freezerService.create(payload);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar freezer.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const salaOptions = salas.map((s) => ({
    value: s.id,
    label: s.nome,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={freezerToEdit ? 'Editar Freezer' : 'Novo Freezer'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {freezerToEdit ? 'Salvar Alterações' : 'Criar Freezer'}
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
          label="Nome do Freezer"
          placeholder="Ex: -20C (Amostras), Freezer -80C..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Sala de Localização"
          options={salaOptions}
          placeholder="Selecione a sala..."
          value={salaId}
          onChange={(e) => setSalaId(Number(e.target.value))}
          required
        />

        <Input
          label="Limite de Gavetas (Opcional)"
          type="number"
          min="1"
          placeholder="Ex: 5 (Deixe em branco para ilimitado)"
          value={maxGavetas}
          onChange={(e) => setMaxGavetas(e.target.value)}
          hint="Usado para o aviso de limite de capacidade."
        />
      </form>
    </Modal>
  );
}
