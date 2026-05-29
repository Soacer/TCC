/*
  Warnings:

  - You are about to drop the column `causa_raiz` on the `Falha` table. All the data in the column will be lost.
  - You are about to drop the column `equipamentos_idequipamentos` on the `Falha` table. All the data in the column will be lost.
  - Added the required column `equipamento_id` to the `Falha` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "CausaRaiz" (
    "idcausaraiz" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Falha" (
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
INSERT INTO "new_Falha" ("data_hora_falha", "data_hora_reparo", "descricao", "idfalhas", "tempo_parada_horas") SELECT "data_hora_falha", "data_hora_reparo", "descricao", "idfalhas", "tempo_parada_horas" FROM "Falha";
DROP TABLE "Falha";
ALTER TABLE "new_Falha" RENAME TO "Falha";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CausaRaiz_nome_key" ON "CausaRaiz"("nome");
