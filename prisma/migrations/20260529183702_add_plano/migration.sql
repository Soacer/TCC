-- CreateTable
CREATE TABLE "Plano" (
    "idplanos" TEXT NOT NULL PRIMARY KEY,
    "tipo_manutencao" TEXT NOT NULL,
    "periocidade_dias" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tarefa" (
    "idtarefas" TEXT NOT NULL PRIMARY KEY,
    "ordem" INTEGER NOT NULL,
    "tarefa" TEXT NOT NULL,
    "tempo_execucao" REAL,
    "descricao" TEXT,
    "planos_idplanos" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tarefa_planos_idplanos_fkey" FOREIGN KEY ("planos_idplanos") REFERENCES "Plano" ("idplanos") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EquipamentoTemPlano" (
    "idequipamentos_tem_planos" TEXT NOT NULL PRIMARY KEY,
    "equipamentos_idequipamentos" TEXT NOT NULL,
    "planos_idplanos" TEXT NOT NULL,
    "ultima_execucao" DATETIME,
    "proxima_execucao" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EquipamentoTemPlano_equipamentos_idequipamentos_fkey" FOREIGN KEY ("equipamentos_idequipamentos") REFERENCES "Equipamento" ("idequipamentos") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EquipamentoTemPlano_planos_idplanos_fkey" FOREIGN KEY ("planos_idplanos") REFERENCES "Plano" ("idplanos") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EquipamentoTemPlano_equipamentos_idequipamentos_planos_idplanos_key" ON "EquipamentoTemPlano"("equipamentos_idequipamentos", "planos_idplanos");
