import { ipcMain } from 'electron';
import { EquipmentRepository } from './repositories/Equipment/EquipmentRepository';
import { CreateEquipmentUseCase } from './useCases/Equipment/CreateEquipmentUseCase';

const repo = new EquipmentRepository();
const createUseCase = new CreateEquipmentUseCase(repo);

export function setupIpcHandlers() {
  ipcMain.handle('create-equipment', async (_, data) => {
    try {
      return await createUseCase.execute(data);
    } catch (error: any) {
      return { error: error.message };
    }
  });
}