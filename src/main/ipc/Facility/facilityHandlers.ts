import { ipcMain } from 'electron';
import { FacilityRepository } from '../../repositories/Facility/FacilityRepository';

export function registerFacilityHandlers() {
  const repository = new FacilityRepository();

  ipcMain.handle('get-plantas', async () => {
    try {
      const data = await repository.getPlantas();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('create-planta', async (_, nome) => {
    try {
      const data = await repository.createPlanta(nome);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('create-setor', async (_, { nome, plantaId }) => {
    try {
      const data = await repository.createSetor(nome, plantaId);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('update-planta', async (_, { id, nome }) => {
    try {
      const data = await repository.updatePlanta(id, nome);
      return { success: true, data };
    } catch (error: any) { return { success: false, error: error.message }; }
  });

  ipcMain.handle('update-setor', async (_, { id, nome }) => {
    try {
      const data = await repository.updateSetor(id, nome);
      return { success: true, data };
    } catch (error: any) { return { success: false, error: error.message }; }
  });

  ipcMain.handle('delete-planta', async (_, id) => {
    try {
      const data = await repository.deletePlanta(id);
      return { success: true, data };
    } catch (error: any) { return { success: false, error: error.message }; }
  });

  ipcMain.handle('delete-setor', async (_, id) => {
    try {
      const data = await repository.deleteSetor(id);
      return { success: true, data };
    } catch (error: any) { return { success: false, error: error.message }; }
  });
}