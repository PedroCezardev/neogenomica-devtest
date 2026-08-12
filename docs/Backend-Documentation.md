# 📖 Backend — Documentação Completa

> Este documento contém toda a especificação técnica do backend NeoGenomica:
> arquitetura em camadas, dependências, variáveis de ambiente, tratamento de erros, autenticação, endpoints e suíte de testes.

---

## 📑 Índice

1. [Stack e Dependências](#1-stack-e-dependências)
2. [Variáveis de Ambiente](#2-variáveis-de-ambiente)
3. [Como Rodar](#3-como-rodar)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Arquitetura em Camadas](#5-arquitetura-em-camadas)
6. [Tratamento de Erros](#6-tratamento-de-erros)
7. [Autenticação JWT](#7-autenticação-jwt)
8. [Endpoints Completos (Swagger / OpenAPI 3.0)](#8-endpoints-completos-swagger--openapi-30)
9. [Algoritmo First-Fit](#9-algoritmo-first-fit)
10. [Importação CSV](#10-importação-csv)
11. [Seed do Banco](#11-seed-do-banco)
12. [Suíte de Testes Unitários e CI/CD](#12-suíte-de-testes-unitários-e-cicd)

---

## 1. Stack e Dependências

### Runtime / Framework

| Pacote | Versão | Para que serve |
|---|---|---|
| `express` | ^5 | Framework HTTP — define rotas, middlewares, controllers |
| `typescript` | ^7 | Tipagem estática — previne erros em tempo de compilação |
| `tsx` | ^4 | Executa TypeScript diretamente sem compilar (dev) |
| `dotenv` | ^17 | Carrega variáveis do `.env` para `process.env` |
| `cors` | ^2 | Libera Cross-Origin para o frontend acessar a API |

### Banco de Dados / ORM

| Pacote | Versão | Para que serve |
|---|---|---|
| `prisma` | ^6 (dev) | CLI: `migrate`, `studio`, `generate` |
| `@prisma/client` | ^6 | Client gerado para consultas no banco de dados |

### Autenticação e Segurança

| Pacote | Versão | Para que serve |
|---|---|---|
| `bcryptjs` | ^3 | Hash de senha com salt seguro |
| `jsonwebtoken` | ^9 | Gera e valida tokens JWT de autenticação |

### Validação & File Upload

| Pacote | Versão | Para que serve |
|---|---|---|
| `zod` | ^4 | Valida e tipifica o body das requisições (DTOs) |
| `csv-parse` | - | Parseia arquivos `.csv` para arrays de objetos |
| `multer` | - | Gerencia upload de arquivos multipart/form-data |

---

## 2. Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# ─── Banco de Dados (Supabase) ───────────────────────────────────────────────
DATABASE_URL="postgresql://postgres.SEU_PROJETO:SUA_SENHA@aws-0-us-east-2.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.SEU_PROJETO:SUA_SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# ─── Servidor ────────────────────────────────────────────────────────────────
PORT=3001

# ─── JWT ─────────────────────────────────────────────────────────────────────
JWT_SECRET="coloque-uma-chave-secreta-longa-e-aleatoria-aqui"
JWT_EXPIRES_IN="7d"

# ─── Ambiente ────────────────────────────────────────────────────────────────
NODE_ENV="development"
```

---

## 3. Como Rodar

```bash
# Instalar dependências
npm install

# Rodar migração inicial (cria as tabelas no banco)
npx prisma migrate dev --name init

# Popular banco com dados de exemplo
npm run seed

# Iniciar servidor de desenvolvimento
npm run dev
# → http://localhost:3001
```

---

## 4. Estrutura de Pastas

```
backend/
├── src/
│   ├── controllers/          # Controladores HTTP (parseia req, chama service, envia res)
│   ├── dtos/                 # Schemas de validação Zod
│   ├── middlewares/          # Middlewares Express (Auth, AppError, ErrorHandler)
│   ├── repositories/         # Acesso ao banco de dados Prisma ORM
│   ├── routes/               # Definição das rotas HTTP da API
│   ├── services/             # Regras de negócio e serviços
│   └── utils/                # Funções utilitárias
└── prisma/                   # Schema do banco de dados, migrações e seed
```

---

## 5. Arquitetura em Camadas

O backend segue o padrão **Layered Architecture** (4 camadas):

```
┌────────────────────────────────────────────┐
│  HTTP Layer (Express)                      │
│  Request → Routes → Controller → Response  │
├────────────────────────────────────────────┤
│  DTO Layer (Zod)                           │
│  Valida e tipifica o body do request       │
├────────────────────────────────────────────┤
│  Service Layer (Regras de Negócio)         │
│  Verifica existência, valida lógica,       │
│  chama repositories, lança AppError        │
├────────────────────────────────────────────┤
│  Repository Layer (Acesso ao Banco)        │
│  Queries Prisma — findMany, create, update │
├────────────────────────────────────────────┤
│  Prisma ORM                                │
│  Traduz para SQL → PostgreSQL (Supabase)   │
└────────────────────────────────────────────┘
```

---

## 6. Tratamento de Erros

O middleware `errorHandler.ts` centraliza o tratamento de exceções da API:

| Tipo | Quando ocorre | HTTP retornado |
|---|---|---|
| `AppError` | Lançado manualmente nos services (ex: "Sala não encontrada") | O `statusCode` definido (404, 409...) |
| `ZodError` | Body da requisição inválido (ex: falta campo obrigatório) | `400` com detalhes por campo |
| `PrismaClientKnownRequestError` | Erros do banco (duplicidade P2002, not found P2025...) | `409`, `404`, `400` |
| `Error` genérico | Qualquer outro erro não esperado | `500` |

---

## 7. Autenticação JWT

A API utiliza tokens JWT para identificação e proteção de endpoints:

```
1. POST /api/auth/register → cria usuário com senha em hash bcrypt
2. POST /api/auth/login    → valida senha, gera JWT com { userId, email }
3. Client guarda o token
4. Requisições protegidas enviam o header: Authorization: Bearer <token>
```

---

## 8. Endpoints Completos (Swagger / OpenAPI 3.0)

A especificação completa de todos os endpoints HTTP, parâmetros de busca, schemas de requisição e respostas da API está centralizada no arquivo de especificação OpenAPI 3.0:

📄 **[Visualizar Especificação Swagger (swagger.yaml)](./swagger.yaml)**

### Resumo dos Recursos da API

- **`/auth`**: Autenticação de usuários, geração e validação de tokens JWT (`/register`, `/login`, `/me`).
- **`/salas`**: Gerenciamento CRUD de Salas Físicas do laboratório.
- **`/freezers`**: Gerenciamento CRUD de Freezers vinculados às salas.
- **`/gavetas`**: Gerenciamento CRUD de Gavetas vinculadas aos freezers.
- **`/caixas`**: Gerenciamento CRUD de Caixas de dimensões $N \times M$ e endpoint da grade do mapa visual (`/caixas/:id/mapa`).
- **`/amostras`**: Cadastro, consulta filtrada, algoritmo First-Fit (`/amostras/sugerir-posicao`) e importação em lote de arquivos CSV (`/amostras/importar`).

---

## 9. Algoritmo First-Fit

O endpoint `GET /api/amostras/sugerir-posicao` implementa o algoritmo **First-Fit**:

1. Busca todas as caixas ordenadas por `criadoEm ASC`.
2. Para cada caixa, gera a sequência de posições (`A1`, `A2` ... `J10`).
3. Carrega as posições ocupadas em um `Set<string>` (busca de complexidade $O(1)$).
4. Retorna a primeira vaga livre e o caminho físico completo (`Sala / Freezer / Gaveta / Caixa / Posição`).
5. Se todas as caixas estiverem cheias, busca gavetas que ainda possuem capacidade disponível para novas caixas.

---

## 10. Importação CSV

O endpoint `POST /api/amostras/importar` recebe um arquivo CSV e realiza a importação idempotente:

- Cria automaticamente Salas, Freezers, Gavetas e Caixas ausentes (*find-or-create*).
- Valida a disponibilidade da posição antes de cadastrar a amostra.
- Retorna um relatório com o total de registros importados, ignorados e erros de linha.

---

## 11. Seed do Banco

O script `prisma/seed.ts` popula o banco de dados inicial a partir do arquivo `amostras_exemplo.csv`.

```bash
npm run seed
```

---

## 12. Suíte de Testes Unitários e CI/CD

A suíte de testes unitários desenvolvida com **Vitest** garante a confiabilidade das regras de negócio:

| Arquivo | Módulo / Alvo | O que testa |
|---|---|---|
| `src/__tests__/posicao.spec.ts` | `utils/posicao.ts` | Geração de posições $N \times M$ (`A1` a `J10`) e validação de limites de caixa. |
| `src/__tests__/sugestao.service.spec.ts` | `sugestao.service.ts` | Algoritmo First-Fit: alocação determinística na 1ª vaga livre e sugestões de expansão quando cheia. |
| `src/__tests__/auth.service.spec.ts` | `auth.service.ts` | Login de usuário, registro com hash de senha `bcryptjs` e validação de credenciais inválidas. |
| `src/__tests__/amostra.service.spec.ts` | `amostra.service.ts` | Criação de amostras, bloqueio de posições duplicadas na mesma caixa e filtros de busca. |
| `src/__tests__/auth.middleware.spec.ts` | `auth.middleware.ts` | Validação de token JWT, injeção de `req.usuarioId` e bloqueio com status HTTP 401. |

### Como Executar os Testes no Backend

```bash
# Executar todos os testes do backend uma única vez
npm test

# Executar os testes em modo watch (desenvolvimento)
npm run test:watch
```

---

*Documentação gerada em: 2026-08-12 — Backend v1.3.0*
