-- CreateEnum
CREATE TYPE "StatusEquipamento" AS ENUM ('OPERANDO', 'PARADO', 'EM_MANUTENCAO', 'FALHA');

-- CreateTable
CREATE TABLE "abc" (
    "idcriticidade" SERIAL NOT NULL,
    "nivel" VARCHAR(1) NOT NULL,

    CONSTRAINT "abc_pkey" PRIMARY KEY ("idcriticidade")
);

-- CreateTable
CREATE TABLE "xyz" (
    "idxyz" SERIAL NOT NULL,
    "nivel" VARCHAR(1) NOT NULL,

    CONSTRAINT "xyz_pkey" PRIMARY KEY ("idxyz")
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "idequipamentos" UUID NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "tag" VARCHAR(45) NOT NULL,
    "fabricante" VARCHAR(45) NOT NULL,
    "modelo" VARCHAR(45) NOT NULL,
    "setor" VARCHAR(45) NOT NULL,
    "data_instalacao" TIMESTAMP(3) NOT NULL,
    "status" "StatusEquipamento" NOT NULL DEFAULT 'OPERANDO',
    "abc_idcriticidade" INTEGER NOT NULL,
    "xyz_idxyz" INTEGER NOT NULL,

    CONSTRAINT "Equipamento_pkey" PRIMARY KEY ("idequipamentos")
);

-- CreateTable
CREATE TABLE "Falha" (
    "idfalhas" UUID NOT NULL,
    "data_hora_falha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_hora_reparo" TIMESTAMP(3),
    "descricao" TEXT NOT NULL,
    "causa_raiz" TEXT,
    "tempo_parada_horas" DOUBLE PRECISION,
    "equipamentos_idequipamentos" UUID NOT NULL,

    CONSTRAINT "Falha_pkey" PRIMARY KEY ("idfalhas")
);

-- CreateIndex
CREATE UNIQUE INDEX "abc_nivel_key" ON "abc"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "xyz_nivel_key" ON "xyz"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "Equipamento_tag_key" ON "Equipamento"("tag");

-- AddForeignKey
ALTER TABLE "Equipamento" ADD CONSTRAINT "Equipamento_abc_idcriticidade_fkey" FOREIGN KEY ("abc_idcriticidade") REFERENCES "abc"("idcriticidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipamento" ADD CONSTRAINT "Equipamento_xyz_idxyz_fkey" FOREIGN KEY ("xyz_idxyz") REFERENCES "xyz"("idxyz") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Falha" ADD CONSTRAINT "Falha_equipamentos_idequipamentos_fkey" FOREIGN KEY ("equipamentos_idequipamentos") REFERENCES "Equipamento"("idequipamentos") ON DELETE RESTRICT ON UPDATE CASCADE;
