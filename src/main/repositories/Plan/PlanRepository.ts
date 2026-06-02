import { PrismaClient } from '@prisma/client';
import { CreatePlanDTO } from '../../../shared/dto/Plan/createPlan.dto';

const prisma = new PrismaClient();

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
      where: { isActive: true },
      include: {
        tarefas: {
          where: { isActive: true }, // 🟢 NOVO: Ignora tarefas deletadas!
          orderBy: { ordem: 'asc' }
        },
        _count: { select: { equipamentos: true } }
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

  async delete(id: string) {
    return await prisma.plano.update({
      where: { idplanos: id },
      data: { isActive: false }
    });
  }
}