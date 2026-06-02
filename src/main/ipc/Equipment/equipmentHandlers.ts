import { ipcMain } from 'electron';
import { EquipmentRepository } from '../../repositories/Equipment/EquipmentRepository';
import { CreateEquipmentUseCase } from '../../useCases/Equipment/CreateEquipmentUseCase';
import { SelectAllEquipmentUseCase } from '../../useCases/Equipment/SelectAllEquipmentUseCase';
import { SoftDeleteEquipmentUseCase } from '../../useCases/Equipment/SoftDeleteEquipmentUseCase';

import type { CreateEquipmentDTO } from '../../../shared/dto/Equipment/CreateEquipmentDTO';
import { UpdateEquipmentUseCase } from '../../useCases/Equipment/UpdateEquipmentUseCase';
import { ReactivateEquipmentUseCase } from '../../useCases/Equipment/ReactivateEquipmentUseCase';


export function registerEquipmentHandlers() {
  ipcMain.handle('create-equipment', async (_, data: CreateEquipmentDTO) => {
    try {
      const repository = new EquipmentRepository();
      const useCase = new CreateEquipmentUseCase(repository);
      
      // O UseCase já tem as travas de TAG duplicada e Data futura
      const newEquipment = await useCase.execute(data);
      
      return { success: true, data: newEquipment };
    } catch (error: any) {
      // Retornamos o erro para o React exibir o alerta na tela
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-equipments', async (_, ) => {
    try {
      const repository = new EquipmentRepository();
      const useCase = new SelectAllEquipmentUseCase(repository);
      
      const equipamentos = await useCase.execute();
      
      return { success: true, data: equipamentos };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('soft-delete-equipment', async (_, id: string) => {
    try {
      const repository = new EquipmentRepository();
      const useCase = new SoftDeleteEquipmentUseCase(repository);
      
      await useCase.execute(id);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('update-equipment', async (_, id: string, data: any) => {
    try {
      const repository = new EquipmentRepository();
      const useCase = new UpdateEquipmentUseCase(repository);
      
      const updatedEquipment = await useCase.execute(id, data);
      
      return { success: true, data: updatedEquipment };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reactivate-equipment', async (_, id: string) => {
  try {
    const repository = new EquipmentRepository();
    const useCase = new ReactivateEquipmentUseCase(repository);
    
    await useCase.execute(id);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});
}