'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Gaveta, Freezer } from '@/types';
import { gavetaService } from '@/services/gaveta.service';

interface GavetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gavetaToEdit?: Gaveta | null;
  freezers: Freezer[];
}

export default function GavetaModal({
  isOpen,
  onClose,
  onSuccess,
  gavetaToEdit,
  freezers,
}: GavetaModalProps) {
  const [nome, setNome] = useState('');
  const [freezerId, setFreezerId] = useState<number | ''>('');
  const [maxCaixas, setMaxCaixas] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gavetaToEdit) {
      setNome(gavetaToEdit.nome);
      setFreezerId(gavetaToEdit.freezerId);
      setMaxCaixas(gavetaToEdit.maxCaixas ? String(gavetaToEdit.maxCaixas) : '');
    } else {
      setNome('');
      setFreezerId(freezers.length > 0 ? freezers[0].id : '');
      setMaxCaixas('');
    }
    setError(null);
  }, [gavetaToEdit, isOpen, freezers]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome da gaveta é obrigatório.');
      return;
    }
    if (!freezerId) {
      setError('Selecione um freezer.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      nome: nome.trim(),
      freezerId: Number(freezerId),
      maxCaixas: maxCaixas ? Number(maxCaixas) : undefined,
    };

    try {
      if (gavetaToEdit) {
        await gavetaService.update(gavetaToEdit.id, payload);
      } else {
        await gavetaService.create(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar gaveta.');
    } finally {
      setLoading(false);
    }
  }

  const freezerOptions = freezers.map((f) => ({
    value: f.id,
    label: `${f.nome} ${f.sala ? `(${f.sala.nome})` : ''}`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={gavetaToEdit ? 'Editar Gaveta' : 'Nova Gaveta'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {gavetaToEdit ? 'Salvar Alterações' : 'Criar Gaveta'}
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
          label="Nome da Gaveta"
          placeholder="Ex: Gaveta 1, Prateleira Superior..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Freezer Pertencente"
          options={freezerOptions}
          placeholder="Selecione o freezer..."
          value={freezerId}
          onChange={(e) => setFreezerId(Number(e.target.value))}
          required
        />

        <Input
          label="Limite de Caixas (Opcional)"
          type="number"
          min="1"
          placeholder="Ex: 10 (Deixe em branco para ilimitado)"
          value={maxCaixas}
          onChange={(e) => setMaxCaixas(e.target.value)}
          hint="Usado para o aviso de limite de capacidade por gaveta."
        />
      </form>
    </Modal>
  );
}
