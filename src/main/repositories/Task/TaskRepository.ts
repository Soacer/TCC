import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
  // Edita os dados de uma tarefa existente
  async update(id: string, data: { tarefa?: string; descricao?: string; tempo_execucao?: number | null }) {
    return await prisma.tarefa.update({
      where: { idtarefas: id },
      data
    });
  }

  // Soft Delete da tarefa
  async softDelete(id: string) {
    return await prisma.tarefa.update({
      where: { idtarefas: id },
      data: { isActive: false }
    });
  }
}