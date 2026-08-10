# 🖥️ Frontend — Plano de Arquitetura

> Plano completo antes de escrever código:
> páginas, modais, componentes, estrutura de pastas e fluxo de navegação.

---

## 🗺️ Páginas (6 páginas)

| # | Rota | Página | Requisito atendido |
|---|---|---|---|
| 1 | `/login` | Login | Bônus: Autenticação |
| 2 | `/` | Dashboard | Overview + acesso rápido |
| 3 | `/estrutura` | Estrutura Física | Req #1 — CRUD Salas/Freezers/Gavetas/Caixas |
| 4 | `/amostras` | Listagem e Busca de Amostras | Req #4 — Visualização/busca |
| 5 | `/amostras/nova` | Cadastrar Nova Amostra | Req #2 + #3 — Cadastro + First-Fit |
| 6 | `/caixas/[id]/mapa` | Mapa Visual da Caixa | Bônus #2 — Visualização em grade |

---

## 🪟 Modais (8 modais)

Todos os CRUDs simples usam modais para não precisar trocar de página.

| # | Modal | Onde aparece | Funcionalidade |
|---|---|---|---|
| 1 | `SalaModal` | `/estrutura` | Criar / Editar Sala |
| 2 | `FreezerModal` | `/estrutura` | Criar / Editar Freezer (com select de Sala) |
| 3 | `GavetaModal` | `/estrutura` | Criar / Editar Gaveta (com select de Freezer) |
| 4 | `CaixaModal` | `/estrutura` | Criar / Editar Caixa (linhas + colunas) |
| 5 | `DeleteModal` | em qualquer página | Confirmação genérica de exclusão |
| 6 | `ImportCSVModal` | `/amostras` | Upload do arquivo .csv + feedback da importação |
| 7 | `SugestaoModal` | `/amostras/nova` | Exibe o resultado do first-fit (caminho completo) |
| 8 | `AmostraDetailModal` | `/caixas/[id]/mapa` | Clicou numa posição ocupada → exibe dados da amostra |

---

## 📁 Estrutura de Pastas

```
frontend/
├── src/
│   │
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                   # Layout raiz (fonte, html, body)
│   │   ├── page.tsx                     # Dashboard (/)
│   │   ├── login/
│   │   │   └── page.tsx                 # Tela de login
│   │   ├── estrutura/
│   │   │   └── page.tsx                 # CRUD da estrutura física
│   │   ├── amostras/
│   │   │   ├── page.tsx                 # Listagem + busca
│   │   │   └── nova/
│   │   │       └── page.tsx             # Formulário nova amostra
│   │   └── caixas/
│   │       └── [id]/
│   │           └── mapa/
│   │               └── page.tsx         # Grade visual da caixa
│   │
│   ├── components/
│   │   ├── layout/                      # Estrutura visual do app
│   │   │   ├── Sidebar.tsx              # Menu lateral de navegação
│   │   │   ├── Header.tsx               # Topo com nome do usuário + logout
│   │   │   └── AppShell.tsx             # Wrapper: Sidebar + Header + {children}
│   │   │
│   │   ├── ui/                          # Componentes genéricos reutilizáveis
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx                # Base de todos os modais
│   │   │   ├── Table.tsx                # Tabela com sorting/empty state
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx                # ex: badge "DNA", "Swab bucal"
│   │   │   ├── StatCard.tsx             # Cards de métricas no dashboard
│   │   │   └── EmptyState.tsx           # Tela quando não tem dados
│   │   │
│   │   ├── estrutura/                   # Componentes da página /estrutura
│   │   │   ├── EstruturaPage.tsx        # Orquestra as 4 tabs
│   │   │   ├── SalaTab.tsx              # Tab + tabela de salas
│   │   │   ├── FreezerTab.tsx
│   │   │   ├── GavetaTab.tsx
│   │   │   ├── CaixaTab.tsx
│   │   │   ├── SalaModal.tsx
│   │   │   ├── FreezerModal.tsx
│   │   │   ├── GavetaModal.tsx
│   │   │   └── CaixaModal.tsx
│   │   │
│   │   ├── amostras/                    # Componentes da página /amostras
│   │   │   ├── AmostraTable.tsx         # Tabela com colunas: código, paciente, local, material
│   │   │   ├── AmostraFiltros.tsx       # Barra de busca + filtros avançados
│   │   │   ├── ImportCSVModal.tsx       # Upload + resultado da importação
│   │   │   └── AmostraDetailModal.tsx   # Detalhes de uma amostra
│   │   │
│   │   ├── nova-amostra/               # Componentes de /amostras/nova
│   │   │   ├── AmostraForm.tsx          # Formulário completo de cadastro
│   │   │   └── SugestaoCard.tsx         # Card que exibe o resultado do first-fit
│   │   │
│   │   └── mapa/                        # Componentes de /caixas/[id]/mapa
│   │       ├── BoxGrid.tsx              # Grade N×M (renderiza as células)
│   │       ├── BoxCell.tsx              # Célula individual (livre/ocupada/hover)
│   │       └── MapaLegenda.tsx          # Legenda: verde=livre, vermelho=ocupado
│   │
│   ├── services/                        # Camada de comunicação com a API
│   │   ├── api.ts                       # Config base: baseURL, headers, token
│   │   ├── auth.service.ts              # login(), register(), getMe()
│   │   ├── sala.service.ts              # getAll(), getById(), create(), update(), remove()
│   │   ├── freezer.service.ts
│   │   ├── gaveta.service.ts
│   │   ├── caixa.service.ts             # getAll(), getMapa()
│   │   └── amostra.service.ts           # getAll(filtros), create(), importarCSV(), sugerirPosicao()
│   │
│   ├── hooks/                           # Custom React Hooks
│   │   ├── useAuth.ts                   # token, usuario, login(), logout()
│   │   ├── useSalas.ts                  # estado + CRUD de salas
│   │   ├── useFreezers.ts
│   │   ├── useGavetas.ts
│   │   ├── useCaixas.ts
│   │   └── useAmostras.ts               # lista, filtros, paginação
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx              # Provider global do token JWT
│   │
│   └── types/
│       └── index.ts                     # Interfaces TypeScript dos modelos
│
├── next.config.ts
└── tsconfig.json
```

---

## 🔄 Fluxo de Navegação

```
[/login]
   ↓ login com JWT
[/] Dashboard
   ├── → [/estrutura]          CRUD das 4 entidades físicas (tabs)
   ├── → [/amostras]           Busca e listagem
   │       ├── → [/amostras/nova]     Cadastrar amostra + first-fit
   │       └── → modal ImportCSV      Upload de CSV
   └── → [/caixas/:id/mapa]    Grade visual (link de dentro de /amostras)
```

---

## 📊 Dashboard — O que vai mostrar

Cards de métricas rápidas:
- Total de amostras cadastradas
- Total de salas / freezers / gavetas / caixas
- Posições livres vs ocupadas (%)
- Atalho: "Adicionar Amostra" → `/amostras/nova`
- Atalho: "Ver Estrutura" → `/estrutura`

---

## 🧊 Página `/estrutura` — 4 Tabs

Cada tab é uma tabela com botões de criar/editar/excluir.
CRUD via modais, sem trocar de página.

```
[Salas] [Freezers] [Gavetas] [Caixas]
           ← tab ativa →
┌──────────────────────────────────────┐
│ Nome          | Freezers | Ações     │
│ Pré           | 1        | ✏️ 🗑️     │
└──────────────────────────────────────┘
[+ Nova Sala]
```

A hierarquia dos selects nos modais:
- **FreezerModal** → select de Sala (quais salas existem)
- **GavetaModal** → select de Freezer
- **CaixaModal** → select de Gaveta + inputs de linhas/colunas

---

## 🧬 Página `/amostras/nova` — Fluxo com First-Fit

```
┌─────────────────────────────────────────────┐
│ Dados da Amostra                            │
│ Código:    [___________]                    │
│ Paciente:  [___________]                    │
│ Material:  [DNA ▼]                          │
│ Exame:     [___________]                    │
│                                             │
│ Localização                                 │
│ [🤖 Sugerir Posição Automaticamente]        │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ ✅ Posição sugerida: C3                 │ │
│ │ 📍 Pré / -20C / Gaveta 1 / CONTROLE    │ │
│ │ [Aceitar Sugestão] [Escolher Manualmente]│ │
│ └─────────────────────────────────────────┘ │
│                                             │
│                        [Cancelar] [Salvar]  │
└─────────────────────────────────────────────┘
```

Se o usuário clicar em "Escolher Manualmente":
- Select de Caixa → input de Posição manual (ex: "B4")

---

## 🗺️ Página `/caixas/[id]/mapa`

Grade visual:
- Verde = livre
- Vermelho/laranja = ocupado
- Hover em ocupado → tooltip com nome do paciente
- Click em ocupado → `AmostraDetailModal`

```
┌──────────────────────────────────────────────────┐
│ CONTROLE INTERNO NEOGENOMICA — 10×10             │
│ Pré / -20C (Amostras) / Gaveta 1                │
│ 47 ocupadas | 53 livres | 47% cheio             │
├──────────────────────────────────────────────────┤
│     1    2    3    4    5    6    7    8    9   10│
│ A  [🟥] [🟥] [🟥] [🟩] [🟥] [🟩] [🟩] [🟩] [🟩][🟩]│
│ B  [🟥] [🟥] [🟩] ...                           │
│ ...                                              │
└──────────────────────────────────────────────────┘
```

---

## 🔐 Autenticação — Como funciona no frontend

1. `AuthContext` guarda: `{ token, usuario }` em memória + localStorage
2. `api.ts` injeta o token em todo request: `Authorization: Bearer <token>`
3. Middleware de rota no Next.js redireciona `/login` se não tem token
4. Logout → limpa localStorage → redireciona para `/login`

---

## 🎨 Design System — Decisões visuais

- **Paleta**: tons de azul escuro/petróleo (laboratório, confiança) + acentos em verde/cyan
- **Fonte**: Inter (Google Fonts) — clean e legível
- **Estilo**: Dark mode sutil, glassmorphism no sidebar
- **Layout**: sidebar fixo à esquerda + conteúdo à direita
- **CSS**: Vanilla CSS com variáveis customizadas (sem Tailwind)

---

## 📦 Dependências Frontend

| Pacote | Para que serve |
|---|---|
| `next` | Framework React |
| `typescript` | Tipagem |
| `react-hook-form` | Gerenciamento de formulários (validação, estado) |
| `zod` | Validação de schema nos forms (mesmo Zod do backend) |

Sem libs externas de UI (Material, Chakra, etc.) — tudo feito na mão com CSS.

---

## ✅ Ordem de Implementação

1. **Setup** — criar projeto Next.js + estrutura de pastas + design system (CSS vars + fonte)
2. **Layout** — AppShell: Sidebar + Header
3. **Auth** — Login page + AuthContext + proteção de rotas
4. **Services** — api.ts + todos os services de API
5. **Estrutura** — `/estrutura` com as 4 tabs e modais
6. **Amostras** — `/amostras` com tabela + filtros + ImportCSV
7. **Nova Amostra** — `/amostras/nova` com first-fit integrado
8. **Mapa** — `/caixas/[id]/mapa` com grade visual
9. **Dashboard** — Página inicial com stats
10. **Polish** — animações, responsividade, loading states

---

*Plano criado em: 2026-08-05*
