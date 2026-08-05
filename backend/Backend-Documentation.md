# 📖 Backend — Documentação Completa

> Este documento contém toda a especificação técnica do backend NeoGenomica:
> arquitetura, dependências, variáveis de ambiente, banco de dados, endpoints e lógica de negócio.

---

## 📑 Índice

1. [Stack e Dependências](#1-stack-e-dependências)
2. [Variáveis de Ambiente](#2-variáveis-de-ambiente)
3. [Como Rodar](#3-como-rodar)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Banco de Dados — Schema](#5-banco-de-dados--schema)
6. [Arquitetura em Camadas](#6-arquitetura-em-camadas)
7. [Como as Camadas se Conversam](#7-como-as-camadas-se-conversam)
8. [Tratamento de Erros](#8-tratamento-de-erros)
9. [Autenticação JWT](#9-autenticação-jwt)
10. [Endpoints Completos](#10-endpoints-completos)
11. [Algoritmo First-Fit](#11-algoritmo-first-fit)
12. [Importação CSV](#12-importação-csv)
13. [Seed do Banco](#13-seed-do-banco)

---

## 1. Stack e Dependências

### Runtime / Framework

| Pacote | Versão | Para que serve |
|---|---|---|
| `express` | ^5 | Framework HTTP — define rotas, middlewares, controllers |
| `typescript` | ^7 | Tipagem estática — pega erros em tempo de compilação |
| `tsx` | ^4 | Executa TypeScript diretamente sem compilar (dev) |
| `dotenv` | ^17 | Carrega variáveis do `.env` para `process.env` |
| `cors` | ^2 | Libera Cross-Origin para o frontend acessar a API |

### Banco de Dados / ORM

| Pacote | Versão | Para que serve |
|---|---|---|
| `prisma` | ^6 (dev) | CLI: `migrate`, `studio`, `generate` |
| `@prisma/client` | ^6 | Client gerado para fazer queries no banco |

### Autenticação e Segurança

| Pacote | Versão | Para que serve |
|---|---|---|
| `bcryptjs` | ^3 | Hash de senha com salt (nunca salvar senha pura) |
| `jsonwebtoken` | ^9 | Gera e valida tokens JWT |

### Validação

| Pacote | Versão | Para que serve |
|---|---|---|
| `zod` | ^4 | Valida e tipifica o body das requisições (DTOs) |

### Importação CSV / Upload

| Pacote | Versão | Para que serve |
|---|---|---|
| `csv-parse` | - | Parseia arquivos `.csv` para arrays de objetos |
| `multer` | - | Gerencia upload de arquivos multipart/form-data |
| `@types/multer` | - (dev) | Tipagens TypeScript do multer |

---

## 2. Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# ─── Banco de Dados (Supabase) ───────────────────────────────────────────────
# URL do pooler — usada em RUNTIME (porta 6543, PgBouncer)
DATABASE_URL="postgresql://postgres.SEU_PROJETO:SUA_SENHA@aws-0-us-east-2.pooler.supabase.com:6543/postgres"

# URL direta — usada em MIGRATIONS (porta 5432, conexão direta sem pooler)
DIRECT_URL="postgresql://postgres.SEU_PROJETO:SUA_SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# ─── Servidor ────────────────────────────────────────────────────────────────
PORT=3001

# ─── JWT ─────────────────────────────────────────────────────────────────────
JWT_SECRET="coloque-uma-chave-secreta-longa-e-aleatoria-aqui"
JWT_EXPIRES_IN="7d"  # Duração do token: 7d, 24h, 60m, etc.

# ─── Ambiente ────────────────────────────────────────────────────────────────
NODE_ENV="development"
```

> **Por que dois URLs do Supabase?**  
> O Supabase usa PgBouncer (pooler) para conexões de aplicação — não suporta certas operações do Prisma Migrate.  
> Para migrações, é necessário usar a porta `5432` (conexão direta).  
> Para o runtime da app, usamos a porta `6543` (pooler) que aguenta mais conexões simultâneas.

---

## 3. Como Rodar

```bash
# Instalar dependências
npm install

# Rodar migração inicial (cria as tabelas no banco)
npx prisma migrate dev --name init

# Popular banco com dados de exemplo
npm run seed

# Iniciar servidor de desenvolvimento (hot reload com tsx watch)
npm run dev
# → http://localhost:3001

# Verificar se está rodando
curl http://localhost:3001/health
```

### Scripts disponíveis no `package.json`

| Script | Comando | O que faz |
|---|---|---|
| `npm run dev` | `tsx watch src/index.ts` | Sobe servidor com hot reload |
| `npm run build` | `tsc` | Compila para JavaScript |
| `npm run start` | `node dist/index.js` | Sobe o build de produção |
| `npm run seed` | `tsx prisma/seed.ts` | Popula o banco com amostras_exemplo.csv |

---

## 4. Estrutura de Pastas

```
backend/
├── src/
│   ├── index.ts              # Entry point: Express, middlewares globais, rotas, error handler
│   │
│   ├── lib/
│   │   └── prisma.ts         # Singleton do PrismaClient (evita múltiplas conexões)
│   │
│   ├── dtos/                 # Data Transfer Objects — schemas Zod de validação do body HTTP
│   │   ├── sala.dto.ts
│   │   ├── freezer.dto.ts
│   │   ├── gaveta.dto.ts
│   │   ├── caixa.dto.ts
│   │   ├── amostra.dto.ts
│   │   └── auth.dto.ts
│   │
│   ├── repositories/         # Acesso ao banco — só queries Prisma, zero regra de negócio
│   │   ├── sala.repository.ts
│   │   ├── freezer.repository.ts
│   │   ├── gaveta.repository.ts
│   │   ├── caixa.repository.ts
│   │   ├── amostra.repository.ts
│   │   └── usuario.repository.ts
│   │
│   ├── services/             # Regras de negócio — orquestra repositories, lança AppError
│   │   ├── sala.service.ts
│   │   ├── freezer.service.ts
│   │   ├── gaveta.service.ts
│   │   ├── caixa.service.ts
│   │   ├── amostra.service.ts
│   │   ├── sugestao.service.ts   # Algoritmo first-fit
│   │   ├── mapa.service.ts       # Grade visual da caixa
│   │   ├── auth.service.ts
│   │   └── importacao.service.ts # Importação CSV idempotente
│   │
│   ├── controllers/          # Camada HTTP — parseia req, chama service, devolve res
│   │   ├── sala.controller.ts
│   │   ├── freezer.controller.ts
│   │   ├── gaveta.controller.ts
│   │   ├── caixa.controller.ts
│   │   ├── amostra.controller.ts
│   │   ├── sugestao.controller.ts
│   │   ├── importacao.controller.ts
│   │   └── auth.controller.ts
│   │
│   ├── middlewares/
│   │   ├── AppError.ts       # Classe de erro customizado com statusCode HTTP
│   │   ├── errorHandler.ts   # Middleware global: trata AppError, ZodError, PrismaError, Error
│   │   └── auth.middleware.ts # Valida token JWT e injeta req.usuarioId
│   │
│   ├── routes/               # Define qual Controller atende cada rota HTTP
│   │   ├── index.ts          # Agregador central — registra todos os routers com seus prefixos
│   │   ├── auth.routes.ts
│   │   ├── sala.routes.ts
│   │   ├── freezer.routes.ts
│   │   ├── gaveta.routes.ts
│   │   ├── caixa.routes.ts
│   │   └── amostra.routes.ts
│   │
│   └── utils/
│       └── posicao.ts        # gerarPosicoes() e isPosicaoValida() para a grade da caixa
│
└── prisma/
    ├── schema.prisma         # Definição dos models (tabelas) e relações
    ├── migrations/           # Histórico de migrações SQL geradas pelo Prisma
    └── seed.ts               # Script de seed — lê CSV e popula banco
```

---

## 5. Banco de Dados — Schema

### Diagrama de Entidades

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌───────┐     ┌─────────┐
│  Sala   │──1:N│ Freezer  │──1:N│ Gaveta  │──1:N│ Caixa │──1:N│ Amostra │
│         │     │          │     │         │     │       │     │         │
│ id      │     │ id       │     │ id      │     │ id    │     │ id      │
│ nome    │     │ nome     │     │ nome    │     │ nome  │     │ posicao │
│ (único) │     │ salaId   │     │freezerId│     │linhas │     │ caixaId │
│         │     │maxGavetas│     │maxCaixas│     │colunas│     │ ...     │
└─────────┘     └──────────┘     └─────────┘     └───────┘     └─────────┘

┌──────────┐
│ Usuario  │   (independente — só para autenticação)
│          │
│ id       │
│ email    │
│ nome     │
│ senha    │   ← hash bcrypt
└──────────┘
```

### Detalhes importantes do Schema

**`Amostra.posicao`** é uma `String`, não uma entidade separada.  
Por que? Posições são calculadas dinamicamente pelo tamanho da caixa (`linhas × colunas`).  
Uma caixa 10×10 tem posições `A1` a `J10`. Criar uma tabela com 100 rows seria desnecessário.

**`Amostra.codigoAmostra`** é `String?` (opcional).  
O CSV real da NeoGenomica tem linhas sem código (ex: controles sem tubo físico).

**`Freezer.maxGavetas`** e **`Gaveta.maxCaixas`** são `Int?` (opcional).  
`null` significa sem limite definido — o sistema não bloqueia a adição.

**Deleção em cascata (onDelete: Cascade)**  
Deletar uma `Sala` remove automaticamente seus `Freezers → Gavetas → Caixas → Amostras`.

---

## 6. Arquitetura em Camadas

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

### Responsabilidade de cada camada

| Camada | Responsabilidade | O que NÃO faz |
|---|---|---|
| **Controller** | Recebe HTTP req/res, valida body (Zod), retorna JSON | Regra de negócio, acesso ao banco |
| **Service** | Aplica regras de negócio, valida existência de entidades, lança erros | Consultas SQL, manipulação HTTP |
| **Repository** | Monta e executa queries Prisma | Regras de negócio, validação |
| **DTO** | Define o formato esperado do body via Zod | Nada — é só um schema |

---

## 7. Como as Camadas se Conversam

### Exemplo prático: `POST /api/amostras`

```
1. Request chega: POST /api/amostras { caixaId: 1, posicao: "A1", pacienteNome: "João" }
   ↓
2. amostra.routes.ts
   router.post('/', amostraController.create)
   ↓
3. amostra.controller.ts — createAmostra()
   const data = createAmostraDto.parse(req.body)   ← Zod valida o body
   const amostra = await amostraService.create(data)
   res.status(201).json(amostra)
   ↓
4. amostra.service.ts — create()
   const caixa = await caixaService.findById(data.caixaId)   ← verifica se caixa existe (404 se não)
   isPosicaoValida(posicao, caixa.linhas, caixa.colunas)      ← valida "A1" dentro do grid
   findByCaixa(caixaId) → ocupadas.some(p => p === posicao)   ← posição já ocupada? (409)
   amostraRepository.create({ ...data, posicao })
   ↓
5. amostra.repository.ts — create()
   return prisma.amostra.create({ data, include: { caixa: ... } })
   ↓
6. PrismaClient → INSERT INTO amostras (...) VALUES (...)
   ↓
7. PostgreSQL (Supabase) → OK
   ↓
8. Retorna amostra criada com hierarquia completa (caixa → gaveta → freezer → sala)
```

### Fluxo de erro

Se a posição já está ocupada no passo 4:
```
service → throw new AppError('Posição "A1" já está ocupada', 409)
  ↓ (o controller captura com try/catch e chama next(err))
errorHandler.ts → é instanceof AppError?
  → res.status(409).json({ erro: 'Posição "A1" já está ocupada' })
```

---

## 8. Tratamento de Erros

O arquivo `errorHandler.ts` é registrado **após todas as rotas** no `index.ts`.  
Ele centraliza 4 tipos de erro:

| Tipo | Quando ocorre | HTTP retornado |
|---|---|---|
| `AppError` | Lançado manualmente nos services (ex: "Sala não encontrada") | O `statusCode` definido (404, 409...) |
| `ZodError` | Body da requisição inválido (ex: falta campo obrigatório) | `400` com detalhes por campo |
| `PrismaClientKnownRequestError` | Erros do banco (duplicidade P2002, not found P2025...) | `409`, `404`, `400` |
| `Error` genérico | Qualquer outro erro não esperado | `500` |

### `AppError` — Erro de negócio controlado

```typescript
// Como lançar no service:
throw new AppError('Sala não encontrada', 404);

// O que o cliente recebe:
{ "erro": "Sala não encontrada" }
```

---

## 9. Autenticação JWT

### Fluxo completo

```
1. POST /api/auth/register → cria usuário com senha em hash bcrypt
2. POST /api/auth/login    → valida senha, gera JWT com { userId, email }
3. Client guarda o token
4. Em cada request protegida:
   Header: Authorization: Bearer <token>
   ↓
   authMiddleware valida o token com JWT_SECRET
   ↓
   Injeta req.usuarioId e req.usuarioEmail no request
   ↓
   Controller acessa req.usuarioId sem precisar decodificar o token de novo
```

### Rotas protegidas vs públicas

```typescript
// auth.routes.ts
router.post('/register', authController.register);      // pública
router.post('/login', authController.login);             // pública
router.get('/me', authMiddleware, authController.getProfile);       // protegida ← token obrigatório
router.get('/usuarios', authMiddleware, authController.findAll);    // protegida ← token obrigatório
```

> Para o desafio, as demais rotas (CRUD, amostras) são públicas para facilitar testes.  
> Em produção, todas as rotas de escrita (POST, PUT, DELETE) deveriam exigir autenticação.

---

## 10. Endpoints Completos

### Base URL: `http://localhost:3001/api`

#### 🔐 Auth

| Método | Rota | Auth? | Body | Retorna |
|---|---|---|---|---|
| POST | `/auth/register` | ❌ | `{ nome, email, senha }` | `{ id, nome, email, criadoEm }` |
| POST | `/auth/login` | ❌ | `{ email, senha }` | `{ token, usuario }` |
| GET | `/auth/me` | ✅ | — | perfil do usuário logado |
| GET | `/auth/usuarios` | ✅ | — | lista todos os usuários |

#### 🏠 Salas

| Método | Rota | Body | Retorna |
|---|---|---|---|
| GET | `/salas` | — | `[{ id, nome, _count.freezers }]` |
| GET | `/salas/:id` | — | `{ id, nome, freezers: [...] }` |
| POST | `/salas` | `{ nome }` | sala criada |
| PUT | `/salas/:id` | `{ nome? }` | sala atualizada |
| DELETE | `/salas/:id` | — | `204 No Content` |

#### ❄️ Freezers

| Método | Rota | Body | Retorna |
|---|---|---|---|
| GET | `/freezers` | — | com sala incluída |
| GET | `/freezers/:id` | — | com gavetas incluídas |
| POST | `/freezers` | `{ nome, salaId, maxGavetas? }` | freezer criado |
| PUT | `/freezers/:id` | campos opcionais | freezer atualizado |
| DELETE | `/freezers/:id` | — | `204` |

#### 🗄️ Gavetas

| Método | Rota | Body | Retorna |
|---|---|---|---|
| GET | `/gavetas` | — | com freezer → sala |
| GET | `/gavetas/:id` | — | com caixas incluídas |
| POST | `/gavetas` | `{ nome, freezerId, maxCaixas? }` | gaveta criada |
| PUT | `/gavetas/:id` | campos opcionais | gaveta atualizada |
| DELETE | `/gavetas/:id` | — | `204` |

#### 📦 Caixas

| Método | Rota | Body | Retorna |
|---|---|---|---|
| GET | `/caixas` | — | com hierarquia completa |
| GET | `/caixas/:id` | — | com amostras da caixa |
| GET | `/caixas/:id/mapa` | — | grade completa (ver abaixo) |
| POST | `/caixas` | `{ nome, gavetaId, linhas, colunas }` | caixa criada |
| PUT | `/caixas/:id` | `{ nome?, gavetaId? }` | caixa atualizada |
| DELETE | `/caixas/:id` | — | `204` (falha se tiver amostras) |

**Resposta do mapa** (`GET /caixas/:id/mapa`):
```json
{
  "caixa": { "id": 1, "nome": "CONTROLE INTERNO", "linhas": 10, "colunas": 10 },
  "caminho": "Pré / -20C (Amostras) / Gaveta 1 / CONTROLE INTERNO",
  "resumo": {
    "totalPosicoes": 100,
    "posicoesOcupadas": 47,
    "posicoesLivres": 53,
    "percentualOcupado": 47
  },
  "grade": [
    { "posicao": "A1", "livre": false, "amostra": { "id": 1, "pacienteNome": "..." } },
    { "posicao": "A2", "livre": true, "amostra": null },
    ...
  ]
}
```

#### 🧬 Amostras

| Método | Rota | Obs | Retorna |
|---|---|---|---|
| GET | `/amostras` | suporta `?codigoAmostra=&pacienteNome=&material=&exame=&caixaId=` | lista com hierarquia |
| GET | `/amostras/:id` | — | amostra com caixa → gaveta → freezer → sala |
| GET | `/amostras/sugerir-posicao` | first-fit | `{ encontrou, posicao, caixaId, caminho }` |
| POST | `/amostras` | `{ codigoAmostra?, pacienteNome, material, posicao, caixaId, ... }` | amostra criada |
| POST | `/amostras/importar` | `form-data: arquivo=<arquivo.csv>` | `{ importadas, ignoradas, erros }` |
| PUT | `/amostras/:id` | `{ pacienteNome?, material?, ... }` (sem posicao/caixaId) | amostra atualizada |
| DELETE | `/amostras/:id` | — | `204` |

---

## 11. Algoritmo First-Fit

O endpoint `GET /api/amostras/sugerir-posicao` implementa o algoritmo **First-Fit** conforme especificado no desafio.

### Lógica implementada (`sugestao.service.ts`)

```
1. Busca TODAS as caixas ordenadas por criadoEm ASC
   → ordem determinística e previsível

2. Para cada caixa:
   a. Gera todas as posições possíveis em ordem linha a linha:
      A1, A2, ..., A{n_colunas}, B1, B2, ..., Z{n_colunas}
   b. Coloca as posições OCUPADAS em um Set (busca O(1))
   c. Percorre as posições e retorna a PRIMEIRA não encontrada no Set

3. Se encontrou posição livre:
   → retorna { encontrou: true, posicao, caixaId, caminho, ... }

4. Se TODAS as caixas estão cheias:
   → busca uma gaveta que ainda tem espaço para nova caixa
   → retorna { encontrou: false, mensagem, sugestaoGaveta }
```

### Exemplo de resposta (posição encontrada)

```json
{
  "encontrou": true,
  "posicao": "C3",
  "caixaId": 1,
  "caminho": "Pré / -20C (Amostras) / Gaveta 1 / CONTROLE INTERNO NEOGENOMICA / C3",
  "totalLivres": 53,
  "caixa": { "id": 1, "nome": "...", "linhas": 10, "colunas": 10, "gaveta": { ... } }
}
```

### Geração de posições (`utils/posicao.ts`)

```typescript
// gerarPosicoes(10, 10) gera:
// ["A1", "A2", ..., "A10", "B1", ..., "J10"]  — 100 posições
function gerarPosicoes(linhas: number, colunas: number): string[] {
  for (let l = 0; l < linhas; l++) {
    const letra = String.fromCharCode(65 + l); // A=65, B=66...
    for (let c = 1; c <= colunas; c++) {
      posicoes.push(`${letra}${c}`);
    }
  }
}
```

---

## 12. Importação CSV

### Endpoint

```
POST /api/amostras/importar
Content-Type: multipart/form-data
Campo: arquivo = <arquivo>.csv
```

### Formato esperado do CSV

```csv
sala,freezer,gaveta,caixa,linhas,colunas,posicao,codigo_amostra,paciente_nome,concentracao_ng_ul,material,exame,observacao
Pré,-20C (Amostras),Gaveta 1,CONTROLE INTERNO NEOGENOMICA,10,10,A1,A0100100049801,Controle extração 06,52.8,DNA,CONTROLE INTERNO NEOGENOMICA,
```

### O que acontece internamente

Para cada linha do CSV, o serviço executa um **find-or-create** em cada nível da hierarquia:

```
1. Sala   → findFirst({ nome }) → se não existe: create
2. Freezer → findFirst({ nome, salaId }) → se não existe: create
3. Gaveta  → findFirst({ nome, freezerId }) → se não existe: create
4. Caixa   → findFirst({ nome, gavetaId }) → se não existe: create (com linhas/colunas do CSV)
5. Amostra → verifica se posição já ocupada → se não: create
```

### Resposta

```json
{
  "mensagem": "Importação concluída: 47 amostras importadas, 0 ignoradas.",
  "total": 47,
  "importadas": 47,
  "ignoradas": 0,
  "erros": []
}
```

### Idempotência

A importação é **segura para rodar múltiplas vezes**:
- Nunca duplica Salas, Freezers, Gavetas ou Caixas
- Ignora amostras cuja posição já está ocupada (conta em `ignoradas`)
- Registra linhas com erro sem interromper toda a importação

---

## 13. Seed do Banco

O script `prisma/seed.ts` popula o banco com os dados reais da NeoGenomica a partir do arquivo `amostras_exemplo.csv` na raiz do projeto.

```bash
npm run seed
```

Internamente, usa a mesma lógica de find-or-create do `importacaoService`.  
Exibe logs no console informando cada entidade criada e o relatório final.

### Configuração no `package.json`

```json
{
  "scripts": {
    "seed": "tsx prisma/seed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

*Documentação gerada em: 2026-08-05 — Backend v1.0.0*
