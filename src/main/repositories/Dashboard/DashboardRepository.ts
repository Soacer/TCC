import { PrismaClient } from "@prisma/client";
import {
  IDashboardRepository,
  DashboardFilters,
} from "../../../shared/interfaces/Dashboard/IDashboardRepository";

const prisma = new PrismaClient();

export class DashboardRepository implements IDashboardRepository {
  async getGlobalKPIs(filters?: DashboardFilters) {
    try {

      // 1. Construir o filtro de Equipamentos baseado na hierarquia
      const whereEquipamento: any = { isActive: true };

      if (filters?.equipamentoId) {
        whereEquipamento.idequipamentos = filters.equipamentoId;
      } else if (filters?.setorId) {
        whereEquipamento.setorId = filters.setorId; // Novo campo OK
      } else if (filters?.plantaId) {
        whereEquipamento.setor = { plantaId: filters.plantaId };
      }

      // 2. Buscar equipamentos dentro do filtro
      const equipamentos = await prisma.equipamento.findMany({
        where: whereEquipamento,
        select: { idequipamentos: true, data_instalacao: true },
      });

      if (equipamentos.length === 0) {
        return {
          success: true,
          data: {
            mtbf: 0,
            mttr: 0,
            disponibilidade: "0.00",
            totalFalhas: 0,
            equipamentosAtivos: 0,
          },
        };
      }

      const eqIds = equipamentos.map((eq) => eq.idequipamentos);

      // 3. Buscar todas as falhas dos equipamentos filtrados
      const falhas = await prisma.falha.findMany({
        where: { equipamento_id: { in: eqIds } },
        select: { data_hora_falha: true, data_hora_reparo: true },
      });

      // 4. Cálculos
      const agora = new Date();
      let tempoTotalHoras = 0;

      equipamentos.forEach((eq) => {
        const instalacao = eq.data_instalacao || agora;
        const diffMs = agora.getTime() - instalacao.getTime();
        tempoTotalHoras += diffMs / (1000 * 60 * 60);
      });

      let downtimeTotalHoras = 0;
      falhas.forEach((falha) => {
        if (falha.data_hora_reparo && falha.data_hora_falha) {
          const diffMs =
            falha.data_hora_reparo.getTime() - falha.data_hora_falha.getTime();
          downtimeTotalHoras += diffMs / (1000 * 60 * 60);
        }
      });

      const totalFalhas = falhas.length;
      const uptimeTotalHoras = Math.max(
        0,
        tempoTotalHoras - downtimeTotalHoras,
      );

      // Evitar divisão por zero
      const mtbf =
        totalFalhas > 0 ? uptimeTotalHoras / totalFalhas : uptimeTotalHoras;
      const mttr = totalFalhas > 0 ? downtimeTotalHoras / totalFalhas : 0;
      const disponibilidade =
        mtbf + mttr > 0 ? (mtbf / (mtbf + mttr)) * 100 : 100;
      return {
        success: true,
        data: {
          mtbf: Math.round(mtbf),
          mttr: Math.round(mttr),
          disponibilidade: disponibilidade.toFixed(2),
          totalFalhas: totalFalhas,
          equipamentosAtivos: equipamentos.length,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getParetoData(filters?: DashboardFilters) {
    try {
      // 1. Reutiliza a mesma lógica de escopo de equipamentos para o Pareto
      const whereEquipamento: any = { isActive: true };

      if (filters?.equipamentoId) {
        whereEquipamento.idequipamentos = filters.equipamentoId;
      } else if (filters?.setorId) {
        whereEquipamento.setorId = filters.setorId;
      } else if (filters?.plantaId) {
        whereEquipamento.setor = { plantaId: filters.plantaId };
      }

      const equipamentos = await prisma.equipamento.findMany({
        where: whereEquipamento,
        select: { idequipamentos: true },
      });

      if (equipamentos.length === 0) return { success: true, data: [] };
      const targetEquipmentIds = equipamentos.map((eq) => eq.idequipamentos);

      // 2. Buscar falhas restritas aos equipamentos filtrados
      const falhas = await prisma.falha.findMany({
        where: {
          equipamento_id: { in: targetEquipmentIds },
        },
        include: { causa_raiz: true },
      });

      const totalFalhas = falhas.length;
      if (totalFalhas === 0) return { success: true, data: [] };

      // 3. Agrupamento por Causa Raiz
      const contagem: Record<string, number> = {};
      falhas.forEach((f) => {
        const nomeCausa = f.causa_raiz?.nome || "Desconhecida";
        contagem[nomeCausa] = (contagem[nomeCausa] || 0) + 1;
      });

      // 4. Ordenação Decrescente (Princípio de Pareto)
      let dadosPareto = Object.entries(contagem)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade);

      // 5. Cálculo do Percentual Acumulado (Curva de Pareto)
      let someAcumulada = 0;
      dadosPareto = dadosPareto.map((item) => {
        someAcumulada += item.quantidade;
        return {
          ...item,
          percentualAcumulado: Number(
            ((someAcumulada / totalFalhas) * 100).toFixed(1),
          ),
        };
      });

      return { success: true, data: dadosPareto };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async findAllPlantas() {
    return { success: true, data: await prisma.planta.findMany() };
  }

  async findSetoresByPlanta(plantaId: string) {
    return {
      success: true,
      data: await prisma.setor.findMany({ where: { plantaId } }),
    };
  }

  async findEquipamentosBySetor(setorId: string) {
    return {
      success: true,
      data: await prisma.equipamento.findMany({ where: { setorId } }),
    };
  }
}
