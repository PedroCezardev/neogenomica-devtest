# 🧬 NeoGenomica — Sistema de Gerenciamento de Microtubos de DNA

[![CI Pipeline](https://github.com/PedroCezardev/neogenomica-devtest/actions/workflows/ci.yaml/badge.svg)](https://github.com/PedroCezardev/neogenomica-devtest/actions/workflows/ci.yaml)

Sistema **Full Stack** desenvolvido para o desafio técnico NeoGenomica 2026.
Substitui planilhas manuais por uma aplicação web profissional, permitindo cadastrar, buscar e visualizar a localização exata de microtubos de DNA em tempo real.

---

## 📚 Central de Documentações (`/docs`)

| Módulo / Documento | Link de Acesso | Conteúdo |
|---|---|---|
| 🏛️ **Arquitetura & Banco de Dados** | [`docs/Arquitetura-e-Banco-de-Dados.md`](./docs/Arquitetura-e-Banco-de-Dados.md) | Visão geral da arquitetura Fullstack, Diagrama ERD do banco, dicionário de dados e regras relacionais |
| 🖥️ **Frontend** | [`docs/Frontend-Documentation.md`](./docs/Frontend-Documentation.md) | Next.js 16, React 19, Design System, componentes, estado global, navegação mobile e testes |
| ⚙️ **Backend** | [`docs/Backend-Documentation.md`](./docs/Backend-Documentation.md) | API Express, Prisma ORM, PostgreSQL (Supabase), Zod, autenticação JWT, algoritmo First-Fit e testes |
| 🔄 **Fluxo de Dev (Desafio 2)** | [`docs/Fluxo-de-Desenvolvimento.md`](./docs/Fluxo-de-Desenvolvimento.md) | Git Flow (GitLab Flow), SemVer, esteira de releases, homologação, hotfix e rollback |
| ⚙️ **Pipeline de CI/CD** | [`docs/Pipeline-CI-CD.md`](./docs/Pipeline-CI-CD.md) | GitHub Actions CI/CD, jobs de teste, ESLint, build check e estratégia de defesa em 2 camadas |
| 📋 **Enunciado do Desafio** | [`docs/README-desafio.md`](./docs/README-desafio.md) | Requisitos e especificações originais do desafio técnico |

---

## 🔄 Fluxo de Desenvolvimento & Git Flow (Desafio 2)

O projeto adota uma variação simplificada e eficiente do **GitLab Flow**, combinada com o padrão de versionamento semântico **[SemVer](https://semver.org/)** (`MAJOR.MINOR.PATCH`):

```
feature/1 ──(PR)──> GitHub Actions CI ──(Merge)──> main ──(Tag SemVer)──> Homologação ──(Aprovação)──> Produção
```

- **Branching Strategy**: O código instável de novas funcionalidades é desenvolvido em branches de feature (`feat/*` ou `fix/*`) e integrado à branch principal `main` exclusivamente através de **Pull Requests** com revisão por pares.
- **Validação Automática em Duas Camadas**:
  - **Local (Pre-commit)**: Roda os 41 testes unitários (Vitest) e linter (ESLint) antes do commit.
  - **Nuvem (GitHub Actions CI)**: Workflow [`.github/workflows/ci.yaml`](./.github/workflows/ci.yaml) executa em containers Linux limpos a cada PR para bloquear código quebrado no repositório remoto.
- **Homologação & Tagging**: Cada release gera um incremento de versão nos arquivos `.version` e `CHANGELOG.md` e dispara uma **Tag Git** (ex: `v1.1.0`), enviando o build para o ambiente de **Homologação**.
- **Hotfix & Rollback**: *Hotfixes* seguem o fluxo contínuo a partir da `main` com tag PATCH (ex: `v1.1.1`). *Rollbacks* em produção são executados re-disparando o deploy a partir de uma tag estável anterior.

> 📖 **Para conferir as especificações completas:**
> Acesse [`docs/Arquitetura-e-Banco-de-Dados.md`](./docs/Arquitetura-e-Banco-de-Dados.md) para a visão geral da solução, [`docs/Fluxo-de-Desenvolvimento.md`](./docs/Fluxo-de-Desenvolvimento.md) para o processo de trabalho e [`docs/Pipeline-CI-CD.md`](./docs/Pipeline-CI-CD.md) para os detalhes da esteira de CI/CD.

---

## ⚡ Quick Start

### Pré-requisitos
- **Node.js** v18+ instalado
- Instância do **PostgreSQL** (ou conta no [Supabase](https://supabase.com))

---

### 1. Subindo o Backend (API REST)

```bash
# 1. Entrar na pasta do backend
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente (.env)
cp .env.example .env
# → edite o .env com suas credenciais do PostgreSQL/Supabase

# 4. Rodar as migrações do banco de dados
npx prisma migrate dev

# 5. Popular o banco com dados reais de exemplo (opcional)
npm run seed

# 6. Iniciar o servidor em modo desenvolvimento
npm run dev
# → API rodando em http://localhost:3001
```

---

### 2. Subindo o Frontend (Next.js)

```bash
# 1. Entrar na pasta do frontend
cd frontend/devtest-frontend

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor em modo desenvolvimento
npm run dev
# → Aplicação rodando em http://localhost:3000
```

---

## 🧪 Suíte de Testes Unitários & Qualidade (CI/CD)

O projeto conta com **41 testes unitários** automatizados (20 no Backend e 21 no Frontend) e validação estática de código com ESLint.

### Executando os Testes do Backend
```bash
cd backend
npm test
```

### Executando os Testes do Frontend
```bash
cd frontend/devtest-frontend
npm test
```

### Executando o Git Pre-Commit Hook (Qualidade Automática)
O projeto utiliza a ferramenta `pre-commit` para rodar todos os testes e linters automaticamente antes de cada commit no Git:

```bash
# Instalar a ferramenta de hooks (se ainda não tiver)
pip install pre-commit

# Executar a verificação em todos os arquivos manualmente
pre-commit run --all-files
```

---

## 🏗️ Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| **Frontend Core** | Next.js 16 (App Router) + React 19 + TypeScript |
| **Estilização UI** | Vanilla CSS + Tailwind CSS 4 Design Tokens + Montserrat Font |
| **Testes Frontend** | Vitest 4 + React Testing Library + jsdom |
| **Backend Core** | Node.js + Express 5 + TypeScript |
| **Banco de Dados** | PostgreSQL (Supabase) + Prisma ORM 6 |
| **Testes Backend** | Vitest 4 (Node environment) |
| **Autenticação** | JWT (JSON Web Tokens) + bcryptjs |
| **Validação** | Zod Schemas |
| **Garantia de Qualidade** | Git Pre-commit Hooks + GitHub Actions CI + ESLint 9 |

---

## 📁 Estrutura do Repositório

```
neogenomica-devtest/
├── docs/                         # Central de Documentações do Projeto
│   ├── Arquitetura-e-Banco-de-Dados.md # Visão Geral Fullstack, Diagrama ERD e Dicionário de Dados
│   ├── Backend-Documentation.md  # Especificação técnica do Backend
│   ├── Frontend-Documentation.md # Especificação técnica do Frontend
│   ├── Fluxo-de-Desenvolvimento.md # Git Flow, SemVer, releases, hotfix, rollback
│   ├── Pipeline-CI-CD.md         # Especificação da esteira CI/CD (GitHub Actions + Pre-commit)
│   ├── README-desafio.md         # Requisitos originais do Desafio 1 e 2
│   ├── Frontend-Plan.md          # Plano de arquitetura do Frontend
│   └── Neogenomica.excalidraw    # Diagrama de fluxo editável
│
├── .github/
│   └── workflows/
│       └── ci.yaml               # Esteira de CI/CD do GitHub Actions
│
├── backend/                      # API REST Express + TypeScript
│   ├── src/
│   │   ├── controllers/          # Camada HTTP req/res
│   │   ├── services/             # Regras de negócio e First-Fit
│   │   ├── repositories/         # Acesso ao banco de dados (Prisma)
│   │   ├── dtos/                 # Schemas Zod de validação
│   │   ├── middlewares/          # Autenticação JWT e Tratamento Global de Erros
│   │   ├── routes/               # Rotas HTTP
│   │   └── __tests__/            # 20 Testes Unitários (Vitest)
│   └── prisma/                   # Schema Prisma, Migrações e Seed
│
├── frontend/                     # Aplicação Web Next.js 16 + React 19
│   └── devtest-frontend/
│       ├── app/                  # Rotas (Dashboard, Estrutura, Amostras, Mapa, Login)
│       ├── components/           # UI, Modais, BoxGrid, Sidebar Collapsible, MobileNav
│       ├── services/             # Chamadas HTTP (api.ts, auth, amostras...)
│       ├── contexts/             # Contexto de Autenticação
│       └── __tests__/            # 21 Testes Unitários (Vitest + RTL)
│
├── .pre-commit-config.yaml       # Configuração dos Hooks Git de Pre-Commit
├── README.md                     # Visão Geral do Projeto
└── amostras_exemplo.csv          # Dados de exemplo do laboratório
```

---

## 🧊 Hierarquia Física do Laboratório

O sistema respeita rigorosamente a estrutura física do laboratório:

```
Sala  →  Freezer  →  Gaveta  →  Caixa (grade N×M)  →  Posição (A1, B3...)  →  Amostra (Microtubo)
```

---

## ✨ Funcionalidades Principais

- **🎯 Sugestão Inteligente (First-Fit)**: Encontra automaticamente a primeira posição livre no estoque laboratorial seguindo a ordem de cadastro.
- **🗺️ Mapa Visual Interativo**: Renderiza uma grade $N \times M$ com status de ocupação, cores por material e tooltips informativos.
- **📥 Importação em Lote via CSV**: Drag-and-drop de arquivos `.csv` com processamento idempotente sem duplicar estruturas.
- **📱 Responsividade Híbrida**: Sidebar fixo/comprimível no Desktop e **Mobile Bottom Navigation Bar** estilo aplicativo em celulares.
- **🛡️ Qualidade & Segurança**: Autenticação JWT, Pre-commit e GitHub Actions CI com **41 testes unitários** protegendo a aplicação contra regressões.

---

## 👤 Autor

**Pedro Cezar** — Desenvolvedor Fullstack
*Processo Seletivo NeoGenomica 2026*
