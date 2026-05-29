import { ipcMain } from 'electron';
import { FailureRepository } from '../../repositories/Failure/FailureRepository';
import { CreateFailureUseCase } from '../../useCases/Failure/CreateFailureUseCase';

export function registerFailureHandlers() {
  
  ipcMain.handle('create-failure', async (_, data: any) => {
    try {
      const repository = new FailureRepository();
      const useCase = new CreateFailureUseCase(repository);
      
      const novaFalha = await useCase.execute(data);
      return { success: true, data: novaFalha };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-failures', async () => {
    try {
      const repository = new FailureRepository();
      // O ideal é criar o GetAllFailuresUseCase, mas se quiser testar direto:
      const falhas = await repository.findAll(); 
      return { success: true, data: falhas };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }); 
}