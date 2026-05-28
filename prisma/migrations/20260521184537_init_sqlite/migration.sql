-- CreateTable
CREATE TABLE "abc" (
    "idcriticidade" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nivel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "xyz" (
    "idxyz" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nivel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "idequipamentos" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPERANDO',
    "abc_idcriticidade" INTEGER NOT NULL,
    "xyz_idxyz" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Equipamento_abc_idcriticidade_fkey" FOREIGN KEY ("abc_idcriticidade") REFERENCES "abc" ("idcriticidade") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_xyz_idxyz_fkey" FOREIGN KEY ("xyz_idxyz") REFERENCES "xyz" ("idxyz") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Falha" (
    "idfalhas" TEXT NOT NULL PRIMARY KEY,
    "data_hora_falha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_hora_reparo" DATETIME,
    "descricao" TEXT NOT NULL,
    "causa_raiz" TEXT,
    "tempo_parada_horas" REAL,
    "equipamentos_idequipamentos" TEXT NOT NULL,
    CONSTRAINT "Falha_equipamentos_idequipamentos_fkey" FOREIGN KEY ("equipamentos_idequipamentos") REFERENCES "Equipamento" ("idequipamentos") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "abc_nivel_key" ON "abc"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "xyz_nivel_key" ON "xyz"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "Equipamento_tag_key" ON "Equipamento"("tag");
