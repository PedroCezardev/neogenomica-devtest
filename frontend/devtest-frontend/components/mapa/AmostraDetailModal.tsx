'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge, { materialVariant } from '@/components/ui/Badge';
import { CelulaMapa } from '@/types';

interface AmostraDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  celula: CelulaMapa | null;
  caminhoCaixa?: string;
}

export default function AmostraDetailModal({
  isOpen,
  onClose,
  celula,
  caminhoCaixa,
}: AmostraDetailModalProps) {
  if (!celula || !celula.amostra) return null;
  const a = celula.amostra;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalhes da Amostra — Posição ${celula.posicao}`}
      size="md"
      footer={
        <Button variant="primary" onClick={onClose}>
          Fechar Ficha
        </Button>
      }
    >
      <div className="space-y-4 animate-fade-in py-1">
        {/* Cabeçalho com nome do paciente e material */}
        <div className="p-4 rounded-xl bg-neo-lighter border border-border flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Paciente</p>
            <h3 className="text-lg font-bold text-text-primary mt-0.5">{a.pacienteNome}</h3>
          </div>
          <Badge variant={materialVariant(a.material)} size="md">
            {a.material}
          </Badge>
        </div>

        {/* Informações técnicas da amostra */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-text-muted font-medium">Código da Amostra</p>
            <p className="font-mono font-bold text-text-primary mt-1">
              {a.codigoAmostra ?? 'Sem código'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-text-muted font-medium">Concentração</p>
            <p className="font-bold text-text-primary mt-1">
              {a.concentracaoNgUl ? `${a.concentracaoNgUl} ng/µL` : '—'}
            </p>
          </div>

          <div className="col-span-2 p-3 rounded-lg bg-card border border-border">
            <p className="text-text-muted font-medium">Exame Cadastrado</p>
            <p className="font-semibold text-text-primary mt-1">
              {a.exame ?? 'Nenhum exame informado'}
            </p>
          </div>
        </div>

        {/* Localização física detalhada */}
        <div className="p-3.5 rounded-xl bg-neo-light/50 border border-neo-teal/30 space-y-1">
          <p className="text-[11px] font-semibold text-neo-teal-dark uppercase tracking-wider">
            Localização na Bancada:
          </p>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-text-primary">
            <span>{caminhoCaixa ?? 'Hierarquia Física'}</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-neo-teal text-white font-bold">
              Posição {celula.posicao}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
