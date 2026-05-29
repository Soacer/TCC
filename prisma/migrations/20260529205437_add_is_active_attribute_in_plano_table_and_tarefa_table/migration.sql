-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EquipamentoTemPlano" (
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
INSERT INTO "new_EquipamentoTemPlano" ("createdAt", "equipamentos_idequipamentos", "idequipamentos_tem_planos", "planos_idplanos", "proxima_execucao", "ultima_execucao", "updatedAt") SELECT "createdAt", "equipamentos_idequipamentos", "idequipamentos_tem_planos", "planos_idplanos", "proxima_execucao", "ultima_execucao", "updatedAt" FROM "EquipamentoTemPlano";
DROP TABLE "EquipamentoTemPlano";
ALTER TABLE "new_EquipamentoTemPlano" RENAME TO "EquipamentoTemPlano";
CREATE UNIQUE INDEX "EquipamentoTemPlano_equipamentos_idequipamentos_planos_idplanos_key" ON "EquipamentoTemPlano"("equipamentos_idequipamentos", "planos_idplanos");
CREATE TABLE "new_Plano" (
    "idplanos" TEXT NOT NULL PRIMARY KEY,
    "tipo_manutencao" TEXT NOT NULL,
    "periocidade_dias" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Plano" ("createdAt", "idplanos", "periocidade_dias", "tipo_manutencao", "updatedAt") SELECT "createdAt", "idplanos", "periocidade_dias", "tipo_manutencao", "updatedAt" FROM "Plano";
DROP TABLE "Plano";
ALTER TABLE "new_Plano" RENAME TO "Plano";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
