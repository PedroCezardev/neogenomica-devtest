'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Sala } from '@/types';
import { salaService } from '@/services/sala.service';

interface SalaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salaToEdit?: Sala | null;
}

export default function SalaModal({
  isOpen,
  onClose,
  onSuccess,
  salaToEdit,
}: SalaModalProps) {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (salaToEdit) {
      setNome(salaToEdit.nome);
    } else {
      setNome('');
    }
    setError(null);
  }, [salaToEdit, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome da sala é obrigatório.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (salaToEdit) {
        await salaService.update(salaToEdit.id, { nome: nome.trim() });
      } else {
        await salaService.create({ nome: nome.trim() });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar sala.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={salaToEdit ? 'Editar Sala' : 'Nova Sala'}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {salaToEdit ? 'Salvar Alterações' : 'Criar Sala'}
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
          label="Nome da Sala"
          placeholder="Ex: Pré-PCR, Análise, Extração..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoFocus
        />
      </form>
    </Modal>
  );
}
