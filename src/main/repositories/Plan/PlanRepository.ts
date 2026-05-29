import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type CreatePlanDTO = {
  tipo_manutencao: string;
  periocidade_dias: number;
  tarefas: {
    ordem: number;
    tarefa: string;
    tempo_execucao?: number | null;
    descricao?: string | null;
  }[];
};

export class PlanRepository {
  // 1. Criar Plano e Tarefas de uma só vez (Nested Write)
  async create(data: CreatePlanDTO) {
    return await prisma.plano.create({
      data: {
        tipo_manutencao: data.tipo_manutencao,
        periocidade_dias: data.periocidade_dias,
        tarefas: {
          create: data.tarefas, // O Prisma cria as tarefas e já amarra os IDs automaticamente!
        },
      },
      include: {
        tarefas: {
          orderBy: { ordem: 'asc' } // Já traz as tarefas ordenadas para o Front-end
        },
      },
    });
  }

  // 2. Buscar todos os Planos (Dicionário)
  async findAll() {
    return await prisma.plano.findMany({
      include: {
        tarefas: {
          orderBy: { ordem: 'asc' }
        },
        _count: {
          select: { equipamentos: true } // Traz quantas máquinas usam esse plano
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 3. Buscar um Plano Específico
  async findById(id: string) {
    return await prisma.plano.findUnique({
      where: { idplanos: id },
      include: { tarefas: { orderBy: { ordem: 'asc' } } }
    });
  }

  // 4. Deletar Plano (Vai deletar as tarefas junto se configurado em cascata no banco, ou precisamos deletar manual)
  async delete(id: string) {
    // Apaga as tarefas filhas primeiro por segurança
    await prisma.tarefa.deleteMany({ where: { planos_idplanos: id } });
    // Apaga o plano pai
    return await prisma.plano.delete({ where: { idplanos: id } });
  }
}