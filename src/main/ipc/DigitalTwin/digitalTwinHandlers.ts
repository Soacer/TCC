import { ipcMain } from 'electron';
import { DigitalTwinRepository } from '../../repositories/DigitalTwin/DigitalTwinRepository';
import { GetDiagramUseCase } from '../../useCases/DigitalTwin/GetDiagramUseCase';
import { SaveDiagramUseCase } from '../../useCases/DigitalTwin/SaveDiagramUseCase';

export function registerDigitalTwinHandlers() {
  const repository = new DigitalTwinRepository();

  // Rota para buscar o layout do gêmeo digital
  ipcMain.handle('get-digital-twin', async (_, setorId) => {
    try {
      const useCase = new GetDiagramUseCase(repository);
      const diagrama = await useCase.execute(setorId);
      return { success: true, data: diagrama };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // Rota para salvar o layout completo
  ipcMain.handle('save-digital-twin', async (_, { setorId, blocks, connections }) => {
    try {
      const useCase = new SaveDiagramUseCase(repository);
      const resultado = await useCase.execute(setorId, blocks, connections);
      return { success: true, data: resultado };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}