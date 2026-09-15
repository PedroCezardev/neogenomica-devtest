/**
 * Seed do banco de dados NeoGenomica
 * Popula o banco com os dados do arquivo amostras_exemplo.csv
 *
 * Rodar: npm run seed
 * (ou: npx prisma db seed)
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

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

async function main() {
  console.log('🧬 Iniciando seed do banco de dados NeoGenomica...\n');

  // Caminho do CSV (2 níveis acima de prisma/)
  const csvPath = path.join(__dirname, '../../amostras_exemplo.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Arquivo não encontrado: ${csvPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows: CsvRow[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  console.log(`📋 ${rows.length} linhas encontradas no CSV\n`);

  let importadas = 0;
  let ignoradas = 0;
  let erros = 0;

  for (const row of rows) {
    try {
      // Find or create: Sala
      let sala = await prisma.sala.findFirst({ where: { nome: row.sala } });
      if (!sala) {
        sala = await prisma.sala.create({ data: { nome: row.sala } });
        console.log(`  ✅ Sala criada: "${sala.nome}"`);
      }

      // Find or create: Freezer
      let freezer = await prisma.freezer.findFirst({
        where: { nome: row.freezer, salaId: sala.id },
      });
      if (!freezer) {
        freezer = await prisma.freezer.create({
          data: { nome: row.freezer, salaId: sala.id },
        });
        console.log(`  ✅ Freezer criado: "${freezer.nome}"`);
      }

      // Find or create: Gaveta
      let gaveta = await prisma.gaveta.findFirst({
        where: { nome: row.gaveta, freezerId: freezer.id },
      });
      if (!gaveta) {
        gaveta = await prisma.gaveta.create({
          data: { nome: row.gaveta, freezerId: freezer.id },
        });
        console.log(`  ✅ Gaveta criada: "${gaveta.nome}"`);
      }

      // Find or create: Caixa
      let caixa = await prisma.caixa.findFirst({
        where: { nome: row.caixa, gavetaId: gaveta.id },
      });
      if (!caixa) {
        caixa = await prisma.caixa.create({
          data: {
            nome: row.caixa,
            gavetaId: gaveta.id,
            linhas: parseInt(row.linhas, 10) || 10,
            colunas: parseInt(row.colunas, 10) || 10,
          },
        });
        console.log(`  ✅ Caixa criada: "${caixa.nome}" (${caixa.linhas}×${caixa.colunas})`);
      }

      // Verificar se posição já ocupada
      const posicao = row.posicao.toUpperCase();
      const ocupada = await prisma.amostra.findFirst({
        where: { caixaId: caixa.id, posicao },
      });

      if (ocupada) {
        ignoradas++;
        continue;
      }

      // Criar Amostra
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
      importadas++;
    } catch (err) {
      console.error(`  ❌ Erro na linha (${row.posicao}):`, err);
      erros++;
    }
  }

  console.log('\n─────────────────────────────────');
  console.log(`✅ Amostras importadas: ${importadas}`);
  console.log(`⏭️  Posições já ocupadas (ignoradas): ${ignoradas}`);
  console.log(`❌ Erros: ${erros}`);
  console.log('─────────────────────────────────');
  console.log('\n🎉 Seed concluído!');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
