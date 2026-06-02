-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipamento" (
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
    "setorId" TEXT,
    CONSTRAINT "Equipamento_abc_idcriticidade_fkey" FOREIGN KEY ("abc_idcriticidade") REFERENCES "abc" ("idcriticidade") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_xyz_idxyz_fkey" FOREIGN KEY ("xyz_idxyz") REFERENCES "xyz" ("idxyz") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor" ("idsetor") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Equipamento" ("abc_idcriticidade", "data_instalacao", "fabricante", "idequipamentos", "isActive", "modelo", "nome", "setorId", "status", "tag", "tipo", "xyz_idxyz") SELECT "abc_idcriticidade", "data_instalacao", "fabricante", "idequipamentos", "isActive", "modelo", "nome", "setorId", "status", "tag", "tipo", "xyz_idxyz" FROM "Equipamento";
DROP TABLE "Equipamento";
ALTER TABLE "new_Equipamento" RENAME TO "Equipamento";
CREATE UNIQUE INDEX "Equipamento_tag_key" ON "Equipamento"("tag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
