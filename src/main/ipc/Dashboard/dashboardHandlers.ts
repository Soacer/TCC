// src/main/ipc/Dashboard/dashboardHandlers.ts
import { ipcMain } from "electron";
import { DashboardRepository } from "../../repositories/Dashboard/DashboardRepository";
import { DashboardFilters } from "../../../shared/interfaces/Dashboard/IDashboardRepository";

export function registerDashboardHandlers() {
  const dashboardRepo = new DashboardRepository();

  // O Electron agora captura o objeto de filtros vindo do frontend
  ipcMain.handle("getGlobalKPIs", async (_event, filters: DashboardFilters) => {
    return await dashboardRepo.getGlobalKPIs(filters);
  });

  ipcMain.handle("getParetoData", async (_event, filters: DashboardFilters) => {
    return await dashboardRepo.getParetoData(filters);
  });
  ipcMain.handle("getPlantas", async () => await dashboardRepo.findAllPlantas());
  ipcMain.handle(
    "getSetores",
    async (_event, plantaId) => await dashboardRepo.findSetoresByPlanta(plantaId),
  );
  ipcMain.handle(
    "getEquipamentos",
    async (_event, setorId) =>
      await dashboardRepo.findEquipamentosBySetor(setorId),
  );
}
