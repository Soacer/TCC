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
CREATE TABLE "CausaRaiz" (
    "idcausaraiz" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT
);

-- CreateTable
CREATE TABLE "Planta" (
    "idplanta" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Setor" (
    "idsetor" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "plantaId" TEXT,
    CONSTRAINT "Setor_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Planta" ("idplanta") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "idequipamentos" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'OUTROS',
    "tag" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "data_instalacao" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPERANDO',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "abc_idcriticidade" INTEGER NOT NULL,
    "xyz_idxyz" INTEGER NOT NULL,
    "setorId" TEXT NOT NULL,
    CONSTRAINT "Equipamento_abc_idcriticidade_fkey" FOREIGN KEY ("abc_idcriticidade") REFERENCES "abc" ("idcriticidade") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_xyz_idxyz_fkey" FOREIGN KEY ("xyz_idxyz") REFERENCES "xyz" ("idxyz") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor" ("idsetor") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Falha" (
    "idfalhas" TEXT NOT NULL PRIMARY KEY,
    "data_hora_falha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_hora_reparo" DATETIME,
    "descricao" TEXT NOT NULL,
    "tempo_parada_horas" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "equipamento_id" TEXT NOT NULL,
    "causa_raiz_id" TEXT,
    CONSTRAINT "Falha_equipamento_id_fkey" FOREIGN KEY ("equipamento_id") REFERENCES "Equipamento" ("idequipamentos") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Falha_causa_raiz_id_fkey" FOREIGN KEY ("causa_raiz_id") REFERENCES "CausaRaiz" ("idcausaraiz") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Plano" (
    "idplanos" TEXT NOT NULL PRIMARY KEY,
    "tipo_manutencao" TEXT NOT NULL,
    "periocidade_dias" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
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
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "planos_idplanos" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tarefa_planos_idplanos_fkey" FOREIGN KEY ("planos_idplanos") REFERENCES "Plano" ("idplanos") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EquipamentoTemPlano" (
    "idequipamentos_tem_planos" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "equipamentos_idequipamentos" TEXT NOT NULL,
    "planos_idplanos" TEXT NOT NULL,
    "ultima_execucao" DATETIME,
    "proxima_execucao" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EquipamentoTemPlano_equipamentos_idequipamentos_fkey" FOREIGN KEY ("equipamentos_idequipamentos") REFERENCES "Equipamento" ("idequipamentos") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EquipamentoTemPlano_planos_idplanos_fkey" FOREIGN KEY ("planos_idplanos") REFERENCES "Plano" ("idplanos") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiagramaBloco" (
    "id_bloco" TEXT NOT NULL PRIMARY KEY,
    "tipo_bloco" TEXT NOT NULL DEFAULT 'default',
    "posicao_x" REAL NOT NULL,
    "posicao_y" REAL NOT NULL,
    "setorId" TEXT NOT NULL,
    "equipamentoId" TEXT,
    CONSTRAINT "DiagramaBloco_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor" ("idsetor") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagramaBloco_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento" ("idequipamentos") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiagramaConexao" (
    "id_conexao" TEXT NOT NULL PRIMARY KEY,
    "tipo_ligacao" TEXT NOT NULL DEFAULT 'SERIE',
    "setorId" TEXT NOT NULL,
    "blocoOrigemId" TEXT NOT NULL,
    "blocoDestinoId" TEXT NOT NULL,
    CONSTRAINT "DiagramaConexao_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor" ("idsetor") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagramaConexao_blocoOrigemId_fkey" FOREIGN KEY ("blocoOrigemId") REFERENCES "DiagramaBloco" ("id_bloco") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagramaConexao_blocoDestinoId_fkey" FOREIGN KEY ("blocoDestinoId") REFERENCES "DiagramaBloco" ("id_bloco") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "abc_nivel_key" ON "abc"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "xyz_nivel_key" ON "xyz"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "CausaRaiz_nome_key" ON "CausaRaiz"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Equipamento_tag_key" ON "Equipamento"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "EquipamentoTemPlano_equipamentos_idequipamentos_planos_idplanos_key" ON "EquipamentoTemPlano"("equipamentos_idequipamentos", "planos_idplanos");
