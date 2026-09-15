'use client';

import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { amostraService } from '@/services/amostra.service';
import { ImportacaoResult } from '@/types';

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const FileCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neo-teal">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="m9 15 2 2 4-4"/>
  </svg>
);

export default function ImportCSVModal({
  isOpen,
  onClose,
  onSuccess,
}: ImportCSVModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportacaoResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function resetState() {
    setSelectedFile(null);
    setLoading(false);
    setError(null);
    setResult(null);
    setIsDragging(false);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function handleFileSelect(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('Apenas arquivos .csv são permitidos.');
      return;
    }
    setError(null);
    setSelectedFile(file);
  }

  async function handleImport() {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const res = await amostraService.importarCSV(selectedFile);
      setResult(res);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao importar arquivo CSV.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importar Amostras via CSV"
      size="md"
      footer={
        result ? (
          <Button variant="primary" onClick={handleClose}>
            Concluir
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!selectedFile || loading}
              loading={loading}
            >
              Processar Importação
            </Button>
          </>
        )
      }
    >
      {!result ? (
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Área de Drag & Drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer
              transition-all duration-200
              ${isDragging
                ? 'border-accent bg-neo-light/60 scale-[0.99]'
                : selectedFile
                ? 'border-neo-teal/50 bg-neo-lighter/40'
                : 'border-border hover:border-accent hover:bg-neo-lighter/30'
              }
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
              }}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileCheckIcon />
                <p className="text-sm font-semibold text-text-primary">{selectedFile.name}</p>
                <p className="text-xs text-text-muted">
                  {(selectedFile.size / 1024).toFixed(1)} KB — Clique ou arraste para substituir
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-text-muted">
                <div className="w-12 h-12 rounded-full bg-neo-lighter flex items-center justify-center text-accent mb-1">
                  <UploadIcon />
                </div>
                <p className="text-sm font-medium text-text-primary">
                  Arraste o arquivo CSV aqui ou <span className="text-accent underline font-semibold">procure no computador</span>
                </p>
                <p className="text-xs text-text-muted">
                  Formato esperado: sala, freezer, gaveta, caixa, linhas, colunas, posicao, codigo_amostra, paciente_nome...
                </p>
              </div>
            )}
          </div>

          <div className="bg-neo-lighter p-3 rounded-lg border border-border text-xs text-text-muted">
            💡 <strong>Idempotência:</strong> O sistema criará as salas, freezers, gavetas e caixas que não existirem e ignorará posições já ocupadas sem duplicar dados.
          </div>
        </div>
      ) : (
        /* Relatório do Resultado */
        <div className="space-y-4 animate-fade-in py-2">
          <div className="p-4 rounded-xl bg-neo-lighter border border-border text-center">
            <h3 className="text-sm font-bold text-text-primary mb-1">Resultado da Importação</h3>
            <p className="text-xs text-text-muted">{result.mensagem}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center">
              <p className="text-xs font-semibold text-green-700">Importadas</p>
              <p className="text-xl font-bold text-green-800 mt-1">{result.importadas}</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
              <p className="text-xs font-semibold text-yellow-700">Ignoradas</p>
              <p className="text-xl font-bold text-yellow-800 mt-1">{result.ignoradas}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
              <p className="text-xs font-semibold text-red-700">Erros</p>
              <p className="text-xl font-bold text-red-800 mt-1">{result.erros.length}</p>
            </div>
          </div>

          {result.erros.length > 0 && (
            <div className="max-h-32 overflow-y-auto p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
              <p className="font-semibold">Linhas com erro:</p>
              {result.erros.map((e, idx) => (
                <p key={idx}>Linha {e.linha}: {e.motivo}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
