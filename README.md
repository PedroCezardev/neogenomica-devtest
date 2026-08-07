# 🧬 NeoGenomica — Sistema de Gerenciamento de Microtubos de DNA

Sistema **Full Stack** desenvolvido como solução ao desafio técnico NeoGenomica 2026.
Substitui o controle de estoque em planilha por uma aplicação web moderna, permitindo localizar amostras rapidamente e gerenciar onde cada microtubo está armazenado.

---

## ⚡ Quick Start

### Pré-requisitos

- **Node.js** v18+
- Conta no **[Supabase](https://supabase.com)** (banco PostgreSQL gerenciado)

### Subindo o Backend

```bash
# 1. Entrar na pasta do backend
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# → edite o .env com suas credenciais do Supabase

# 4. Rodar as migrações do banco
npx prisma migrate dev

# 5. Popular o banco com dados de exemplo (opcional)
npm run seed

# 6. Iniciar o servidor em desenvolvimento
npm run dev
# → API disponível em http://localhost:3001
```

### Subindo o Frontend

```bash
# Em breve — frontend em desenvolvimento
cd frontend
npm install
npm run dev
```

---

## 🏗️ Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Backend** | Node.js + Express + TypeScript |
| **Banco de Dados** | PostgreSQL via Supabase |
| **ORM** | Prisma 6 |
| **Autenticação** | JWT + bcrypt |
| **Validação** | Zod |

---

## 📁 Estrutura do Projeto

```
neogenomica-devtest/
├── backend/                  # API REST Express + TypeScript
│   ├── src/
│   │   ├── controllers/      # Camada HTTP (entrada/saída)
│   │   ├── services/         # Regras de negócio
│   │   ├── repositories/     # Acesso ao banco (Prisma)
│   │   ├── dtos/             # Schemas de validação (Zod)
│   │   ├── middlewares/      # Auth JWT, Error Handler
│   │   ├── routes/           # Definição de rotas
│   │   ├── utils/            # Utilitários compartilhados
│   │   └── lib/              # Singleton do Prisma Client
│   └── prisma/
│       ├── schema.prisma     # Modelo de dados
│       ├── migrations/       # Histórico de migrações SQL
│       └── seed.ts           # Script para popular o banco
│
├── frontend/                 # (em desenvolvimento)
├── README.md                 # Este arquivo
├── README-desafio.md         # Enunciado original do desafio
└── amostras_exemplo.csv      # Dados reais de exemplo para seed/import
```

---

## 🧊 Hierarquia de Armazenamento

O sistema segue a hierarquia física real do laboratório:

```
Sala  →  Freezer  →  Gaveta  →  Caixa (grade N×M)  →  Posição (A1, B3...)  →  Amostra
```

---

## 🔌 API — Visão Geral das Rotas

| Módulo | Prefixo | Descrição |
|---|---|---|
| Auth | `/api/auth` | Registro, login, perfil |
| Salas | `/api/salas` | CRUD de salas |
| Freezers | `/api/freezers` | CRUD de freezers |
| Gavetas | `/api/gavetas` | CRUD de gavetas |
| Caixas | `/api/caixas` | CRUD + mapa visual da grade |
| Amostras | `/api/amostras` | CRUD + busca + sugestão first-fit + importação CSV |

> 📄 **Documentação completa do backend:** [`backend/Backend-Documentation.md`](./backend/Backend-Documentation.md)
> Contém: todos os endpoints, payloads, variáveis de ambiente, dependências, arquitetura detalhada e fluxo de dados.

---

## ✅ Funcionalidades Implementadas

### Requisitos Obrigatórios
- [x] CRUD completo de Salas, Freezers, Gavetas e Caixas
- [x] Cadastro de amostras com validação de posição
- [x] **Sugestão automática de posição** (algoritmo First-Fit)
- [x] Busca e listagem de amostras com localização completa

### Bônus
- [x] Limites de capacidade (max gavetas/freezer, max caixas/gaveta)
- [x] Mapa visual da grade da caixa (`GET /api/caixas/:id/mapa`)
- [x] Importação via CSV (`POST /api/amostras/importar`)
- [x] Autenticação JWT
- [x] Busca/filtro avançado por material, exame, código, nome

---

## 🌱 Seed de Dados

Para popular o banco com os dados reais do laboratório (arquivo `amostras_exemplo.csv`):

```bash
cd backend
npm run seed
```

O seed é **idempotente** — pode ser executado múltiplas vezes sem duplicar dados.

---

## 👤 Autor

**Pedro Cezar** — Processo Seletivo NeoGenomica 2026
