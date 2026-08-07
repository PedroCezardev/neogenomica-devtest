'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import SugestaoCard from '@/components/nova-amostra/SugestaoCard';
import { Caixa, SugestaoResponse } from '@/types';
import { amostraService } from '@/services/amostra.service';
import { caixaService } from '@/services/caixa.service';
import { ApiError } from '@/services/api';

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function NovaAmostraPage() {
  const router = useRouter();

  // Modos de Alocação: 'auto' (First-Fit) ou 'manual'
  const [modoAlocacao, setModoAlocacao] = useState<'auto' | 'manual'>('auto');

  // Campos do Formulário
  const [pacienteNome, setPacienteNome] = useState('');
  const [codigoAmostra, setCodigoAmostra] = useState('');
  const [material, setMaterial] = useState('DNA');
  const [concentracao, setConcentracao] = useState('');
  const [exame, setExame] = useState('');
  const [observacao, setObservacao] = useState('');

  // Posição e Caixa Selecionadas
  const [caixaId, setCaixaId] = useState<number | ''>('');
  const [posicao, setPosicao] = useState('');

  // Dados auxiliares & First-Fit
  const [caixas, setCaixas] = useState<Caixa[]>([]);
  const [sugestao, setSugestao] = useState<SugestaoResponse | null>(null);
  const [loadingSugestao, setLoadingSugestao] = useState(false);
  const [sugestaoAplicada, setSugestaoAplicada] = useState(false);

  // Status de Envio
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega caixas existentes para seleção manual
  useEffect(() => {
    caixaService.getAll().then(setCaixas).catch(() => []);
  }, []);

  // Busca sugestão de posição no algoritmo First-Fit
  const buscarSugestao = useCallback(async () => {
    setLoadingSugestao(true);
    setSugestaoAplicada(false);
    try {
      const res = await amostraService.sugerirPosicao();
      setSugestao(res);

      if (res.encontrou) {
        setCaixaId(res.caixaId);
        setPosicao(res.posicao);
        setSugestaoAplicada(true);
      }
    } catch {
      setSugestao(null);
    } finally {
      setLoadingSugestao(false);
    }
  }, []);

  // Executa o First-Fit automaticamente ao abrir a página
  useEffect(() => {
    buscarSugestao();
  }, [buscarSugestao]);

  function aplicarSugestao() {
    if (sugestao && sugestao.encontrou) {
      setCaixaId(sugestao.caixaId);
      setPosicao(sugestao.posicao);
      setModoAlocacao('auto');
      setSugestaoAplicada(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pacienteNome.trim()) {
      setError('Informe o nome do paciente.');
      return;
    }
    if (!caixaId || !posicao.trim()) {
      setError('Defina a caixa e a posição onde a amostra será armazenada.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await amostraService.create({
        pacienteNome: pacienteNome.trim(),
        codigoAmostra: codigoAmostra.trim() || null,
        material: material.trim(),
        concentracaoNgUl: concentracao ? Number(concentracao) : null,
        exame: exame.trim() || null,
        observacao: observacao.trim() || null,
        caixaId: Number(caixaId),
        posicao: posicao.trim().toUpperCase(),
      });

      router.push('/amostras');
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : 'Erro ao cadastrar amostra.');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const materialOptions = [
    { value: 'DNA', label: 'DNA' },
    { value: 'Swab bucal', label: 'Swab Bucal' },
    { value: 'Sangue total', label: 'Sangue Total' },
    { value: 'Outros', label: 'Outros' },
  ];

  const caixaOptions = caixas.map((c) => ({
    value: c.id,
    label: `${c.nome} (${c.linhas}×${c.colunas})`,
  }));

  const caixaAtual = caixas.find((c) => c.id === Number(caixaId));

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      <div className="flex items-center gap-3">
        <Link href="/amostras">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeftIcon /> Voltar para Amostras
          </Button>
        </Link>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-xl font-bold text-text-primary tracking-tight">Cadastrar Nova Amostra</h2>
        <p className="text-xs text-text-muted mt-1">
          Adicione um novo microtubo ao sistema. O First-Fit calculará a melhor vaga automaticamente.
        </p>
      </div>

      {/* Grid de Duas Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-7 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v4M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Alternador do Modo de Alocação */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-primary">Modo de Alocação da Posição:</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-neo-lighter rounded-xl border border-border">
              <button
                type="button"
                onClick={() => {
                  setModoAlocacao('auto');
                  if (sugestao?.encontrou) aplicarSugestao();
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  modoAlocacao === 'auto'
                    ? 'bg-card text-neo-teal-dark shadow-sm border border-border'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                🤖 Sugestão Automática (First-Fit)
              </button>

              <button
                type="button"
                onClick={() => setModoAlocacao('manual')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  modoAlocacao === 'manual'
                    ? 'bg-card text-neo-darkest shadow-sm border border-border'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                🖐️ Seleção Manual
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome do Paciente"
              placeholder="Ex: Maria Eduarda Santos"
              value={pacienteNome}
              onChange={(e) => setPacienteNome(e.target.value)}
              required
              autoFocus
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Código da Amostra (Opcional)"
                placeholder="Ex: A0100100049801"
                value={codigoAmostra}
                onChange={(e) => setCodigoAmostra(e.target.value)}
              />

              <Select
                label="Tipo de Material"
                options={materialOptions}
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Concentração (ng/µL)"
                type="number"
                step="0.1"
                placeholder="Ex: 45.2"
                value={concentracao}
                onChange={(e) => setConcentracao(e.target.value)}
              />

              <Input
                label="Exame"
                placeholder="Ex: PAINEL GENÉTICO NEOGENOMICA"
                value={exame}
                onChange={(e) => setExame(e.target.value)}
              />
            </div>

            <Input
              label="Observação (Opcional)"
              placeholder="Observações do lote, aliquota, etc."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />

            {/* Configuração de Posição */}
            <div className="pt-4 border-t border-border space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Definição do Local de Armazenamento
              </h3>

              {modoAlocacao === 'manual' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neo-lighter/40 p-4 rounded-xl border border-border">
                  <Select
                    label="Caixa de Destino"
                    options={caixaOptions}
                    placeholder="Selecione uma caixa..."
                    value={caixaId}
                    onChange={(e) => setCaixaId(Number(e.target.value))}
                    required
                  />

                  <Input
                    label="Posição (Linha/Coluna)"
                    placeholder="Ex: A1, C3, H10"
                    value={posicao}
                    onChange={(e) => setPosicao(e.target.value.toUpperCase())}
                    required
                    hint={caixaAtual ? `Grade da caixa: ${caixaAtual.linhas}x${caixaAtual.colunas}` : undefined}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-neo-light/50 border border-neo-teal/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-muted">Caixa selecionada:</span>
                    <span className="font-bold text-text-primary">
                      {caixaAtual?.nome ?? (caixaId ? `Caixa #${caixaId}` : 'Aguardando sugestão...')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-muted">Posição na grade:</span>
                    <span className="font-mono font-extrabold text-accent text-sm">
                      {posicao || '—'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Ações do Formulário */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <Link href="/amostras">
                <Button variant="outline" type="button" disabled={submitting}>
                  Cancelar
                </Button>
              </Link>
              <Button variant="primary" type="submit" loading={submitting}>
                Salvar e Alocar Amostra
              </Button>
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA */}
        <div className="lg:col-span-5">
          <SugestaoCard
            sugestao={sugestao}
            loading={loadingSugestao}
            onBuscarSugestao={buscarSugestao}
            onAplicarSugestao={aplicarSugestao}
            sugestaoAplicada={sugestaoAplicada}
          />
        </div>

      </div>
    </div>
  );
}
