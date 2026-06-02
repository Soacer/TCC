import { TaskRepository } from '../../repositories/Task/TaskRepository';

export class UpdateTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(id: string, data: any) {
    if (!id) throw new Error("ID da tarefa é obrigatório para edição.");
    return await this.repository.update(id, data);
  }
}