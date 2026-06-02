import { TaskRepository } from '../../repositories/Task/TaskRepository';

export class DeleteTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(id: string) {
    if (!id) throw new Error("ID da tarefa é obrigatório para exclusão.");
    return await this.repository.softDelete(id);
  }
}