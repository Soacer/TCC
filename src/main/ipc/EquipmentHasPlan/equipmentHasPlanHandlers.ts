import { ipcMain } from 'electron';
import { EquipmentHasPlanRepository } from '../../repositories/EquipmentHasPlan/EquipmentHasPlanRepository';
import { LinkPlanUseCase } from '../../useCases/EquipmentHasPlan/LinkPlanUseCase';
import { RegisterExecutionUseCase } from '../../useCases/EquipmentHasPlan/RegisterExecutionUseCase';

export function registerEquipmentHasPlanHandlers() {
  const repository = new EquipmentHasPlanRepository();

  // Rota para anexar plano ao equipamento
  ipcMain.handle('link-plan-to-equipment', async (_, { equipamentoId, planoId }) => {
    try {
      const useCase = new LinkPlanUseCase(repository);
      const vinculo = await useCase.execute(equipamentoId, planoId);
      return { success: true, data: vinculo };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // Rota para buscar os planos de uma máquina
  ipcMain.handle('get-equipment-plans', async (_, equipamentoId) => {
    try {
      const planos = await repository.findByEquipamento(equipamentoId);
      return { success: true, data: planos };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // Rota para dar o "Check" na manutenção (Atualiza as datas)
  ipcMain.handle('register-plan-execution', async (_, { idVinculo, dataExecucao, periocidadeDias }) => {
    try {
      const useCase = new RegisterExecutionUseCase(repository);
      const atualizado = await useCase.execute(idVinculo, dataExecucao, periocidadeDias);
      return { success: true, data: atualizado };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}