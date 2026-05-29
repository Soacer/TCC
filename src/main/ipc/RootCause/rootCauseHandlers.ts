// src/main/ipc/RootCauses/rootCauseHandlers.ts
import { ipcMain } from 'electron';
import { RootCauseRepository } from '../../repositories/RootCause/RootCauseRepository';

// DICA: Se você ainda não moveu, recomendo mover o arquivo GetCausasRaizUseCase.ts 
// para a pasta src/main/useCases/RootCauses/ também!
import { GetCausasRaizUseCase } from '../../useCases/RootCause/RootCauseUseCaste';

export function registerRootCauseHandlers() {
  ipcMain.handle('get-causas-raiz', async () => {
    try {
      const repository = new RootCauseRepository();
      const useCase = new GetCausasRaizUseCase(repository);
      
      const causas = await useCase.execute();
      return { success: true, data: causas };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}