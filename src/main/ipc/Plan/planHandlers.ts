import { ipcMain } from 'electron';
import { PlanRepository } from '../../repositories/Plan/PlanRepository';
import { CreatePlanUseCase } from '../../useCases/Plan/CreatePlanUseCase';
import { GetAllPlansUseCase } from '../../useCases/Plan/GetAllPlansUseCase';

export function registerPlanHandlers() {
  const repository = new PlanRepository();

  // Rota de Criação
  ipcMain.handle('create-plan', async (_, data) => {
    try {
      const useCase = new CreatePlanUseCase(repository);
      const novoPlano = await useCase.execute(data);
      return { success: true, data: novoPlano };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // Rota de Listagem
  ipcMain.handle('get-plans', async () => {
    try {
      const useCase = new GetAllPlansUseCase(repository);
      const planos = await useCase.execute();
      return { success: true, data: planos };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}