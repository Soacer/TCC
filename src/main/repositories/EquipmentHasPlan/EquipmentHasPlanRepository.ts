import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EquipmentHasPlanRepository {
  // 1. Anexar um Plano Mestre a um Equipamento específico
  async link(equipamentoId: string, planoId: string) {
    return await prisma.equipamentoTemPlano.create({
      data: {
        equipamentos_idequipamentos: equipamentoId,
        planos_idplanos: planoId,
        // Ao anexar, as datas de execução começam nulas até o técnico realizar a primeira manutenção
      },
    });
  }

  // 2. Buscar a "Prancheta" de um Equipamento (Todos os planos associados a ele)
  async findByEquipamento(equipamentoId: string) {
    return await prisma.equipamentoTemPlano.findMany({
      where: { equipamentos_idequipamentos: equipamentoId },
      include: {
        plano: {
          include: {
            tarefas: {
              where: { isActive: true }, // 🟢 Ignora as tarefas deletadas
              orderBy: { ordem: "asc" },
            },
          },
        },
      },
    });
  }

  // 3. A Mágica do DER: Registar a execução e calcular automaticamente a próxima data!
  async registerExecution(
    idVinculo: string,
    dataExecucao: Date,
    periocidadeDias: number,
  ) {
    const dataProxima = new Date(dataExecucao);
    dataProxima.setDate(dataProxima.getDate() + periocidadeDias);

    return await prisma.equipamentoTemPlano.update({
      where: { idequipamentos_tem_planos: idVinculo },
      data: {
        ultima_execucao: dataExecucao,
        proxima_execucao: dataProxima,
      },
    });
  }
}
