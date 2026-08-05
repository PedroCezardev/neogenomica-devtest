-- CreateTable
CREATE TABLE "salas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freezers" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "maxGavetas" INTEGER,
    "salaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freezers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gavetas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "maxCaixas" INTEGER,
    "freezerId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gavetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caixas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "linhas" INTEGER NOT NULL,
    "colunas" INTEGER NOT NULL,
    "gavetaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caixas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amostras" (
    "id" SERIAL NOT NULL,
    "codigoAmostra" TEXT,
    "pacienteNome" TEXT NOT NULL,
    "concentracaoNgUl" DOUBLE PRECISION,
    "material" TEXT NOT NULL,
    "exame" TEXT,
    "observacao" TEXT,
    "posicao" TEXT NOT NULL,
    "caixaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "amostras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "salas_nome_key" ON "salas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "freezers" ADD CONSTRAINT "freezers_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gavetas" ADD CONSTRAINT "gavetas_freezerId_fkey" FOREIGN KEY ("freezerId") REFERENCES "freezers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixas" ADD CONSTRAINT "caixas_gavetaId_fkey" FOREIGN KEY ("gavetaId") REFERENCES "gavetas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amostras" ADD CONSTRAINT "amostras_caixaId_fkey" FOREIGN KEY ("caixaId") REFERENCES "caixas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
