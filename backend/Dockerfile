# ─── Estágio 1: Builder (Instalação e Compilação) ──────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia manifests de dependências e schema do Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências e gera o Prisma Client
RUN npm ci || npm install
RUN npx prisma generate

# Copia código-fonte e compila TypeScript para JavaScript (dist/)
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ─── Estágio 2: Runner (Imagem final de produção enxuta) ───────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia manifests e instala apenas dependências de produção
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev || npm install --omit=dev

# Copia a aplicação compilada e a engine gerada pelo Prisma do estágio builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

CMD ["node", "dist/index.js"]
