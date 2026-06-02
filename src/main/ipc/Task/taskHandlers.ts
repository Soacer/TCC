import { ipcMain } from 'electron';
import { TaskRepository } from '../../repositories/Task/TaskRepository';
import { UpdateTaskUseCase } from '../../useCases/Task/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../useCases/Task/DeleteTaskUseCase';

export function registerTaskHandlers() {
  const repository = new TaskRepository();

  ipcMain.handle('update-task', async (_, { id, data }) => {
    try {
      const useCase = new UpdateTaskUseCase(repository);
      const atualizado = await useCase.execute(id, data);
      return { success: true, data: atualizado };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('delete-task', async (_, id) => {
    try {
      const useCase = new DeleteTaskUseCase(repository);
      const deletado = await useCase.execute(id);
      return { success: true, data: deletado };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}