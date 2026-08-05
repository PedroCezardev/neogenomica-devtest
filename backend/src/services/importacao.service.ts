import { parse } from 'csv-parse/sync';
import prisma from '../lib/prisma';

interface CsvRow {
  sala: string;
  freezer: string;
  gaveta: string;
  caixa: string;
  linhas: string;
  colunas: string;
  posicao: string;
  codigo_amostra: string;
  paciente_nome: string;
  concentracao_ng_ul: string;
  material: string;
  exame: string;
  observacao: string;
}

/**
 Importação CSV idempotente:
  - Cria Sala/Freezer/Gaveta/Caixa se não existirem (find-or-create)
  - Ignora amostras com posição já ocupada (não sobrescreve)
  - Retorna relatório com importadas, ignoradas e erros
 */

export const importacaoService = {
  
  async importarCSV(buffer: Buffer) {
    const content = buffer.toString('utf-8');

    const rows: CsvRow[] = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true, // remove BOM se existir
    });

    const resultado = {
      total: rows.length,
      importadas: 0,
      ignoradas: 0,
      erros: [] as { linha: number; motivo: string }[],
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const numLinha = i + 2; // +2 porque linha 1 é o header

      try {
        // Validação mínima
        if (!row.sala || !row.freezer || !row.gaveta || !row.caixa || !row.posicao) {
          resultado.erros.push({ linha: numLinha, motivo: 'Campos obrigatórios faltando (sala, freezer, gaveta, caixa, posicao)' });
          continue;
        }

        // ─── Find or Create: Sala ───
        let sala = await prisma.sala.findFirst({ where: { nome: row.sala } });
        if (!sala) sala = await prisma.sala.create({ data: { nome: row.sala } });

        // ─── Find or Create: Freezer ───
        let freezer = await prisma.freezer.findFirst({
          where: { nome: row.freezer, salaId: sala.id },
        });
        if (!freezer) {
          freezer = await prisma.freezer.create({
            data: { nome: row.freezer, salaId: sala.id },
          });
        }

        // ─── Find or Create: Gaveta ───
        let gaveta = await prisma.gaveta.findFirst({
          where: { nome: row.gaveta, freezerId: freezer.id },
        });
        if (!gaveta) {
          gaveta = await prisma.gaveta.create({
            data: { nome: row.gaveta, freezerId: freezer.id },
          });
        }

        // ─── Find or Create: Caixa ───
        let caixa = await prisma.caixa.findFirst({
          where: { nome: row.caixa, gavetaId: gaveta.id },
        });
        if (!caixa) {
          const linhas = parseInt(row.linhas, 10) || 10;
          const colunas = parseInt(row.colunas, 10) || 10;
          caixa = await prisma.caixa.create({
            data: { nome: row.caixa, gavetaId: gaveta.id, linhas, colunas },
          });
        }

        // ─── Verificar se posição já está ocupada ───
        const posicao = row.posicao.toUpperCase();
        const posicaoOcupada = await prisma.amostra.findFirst({
          where: { caixaId: caixa.id, posicao },
        });

        if (posicaoOcupada) {
          resultado.ignoradas++;
          continue;
        }

        // ─── Criar Amostra ───
        await prisma.amostra.create({
          data: {
            codigoAmostra: row.codigo_amostra || null,
            pacienteNome: row.paciente_nome || 'Sem nome',
            concentracaoNgUl: row.concentracao_ng_ul ? parseFloat(row.concentracao_ng_ul) : null,
            material: row.material || 'Não informado',
            exame: row.exame || null,
            observacao: row.observacao || null,
            posicao,
            caixaId: caixa.id,
          },
        });

        resultado.importadas++;
      } catch (err) {
        resultado.erros.push({
          linha: numLinha,
          motivo: err instanceof Error ? err.message : 'Erro desconhecido',
        });
      }
    }

    return resultado;
  },
};
