import { prisma } from '../database/prisma';

export class CalculateMetricsUseCase {
  /**
   * Calcula os KPIs de manutenção para um equipamento específico.
   * @param equipmentId ID do equipamento no PostgreSQL
   */
  async execute(equipmentId: string) {
    // 1. Busca o equipamento e seu histórico de falhas
    const equipamento = await prisma.equipamento.findUnique({
      where: { idequipamentos: equipmentId },
      include: { falhas: true }
    });

    if (!equipamento) throw new Error("Equipamento não encontrado.");

    const falhas = equipamento.falhas;
    const totalFalhas = falhas.length;

    // Se não houver falhas, a disponibilidade é 100%
    if (totalFalhas === 0) {
      return { 
        mtbf: "Incalculável (Sem falhas)", 
        mttr: 0, 
        disponibilidade: "100.00%",
        totalFalhas: 0
      };
    }

    // 2. Cálculo do Tempo Total de Parada (Downtime)
    const totalDowntimeHoras = falhas.reduce((acc, f) => acc + (f.tempo_parada_horas || 0), 0);

    // 3. Cálculo do Tempo Total de Vida (Desde a instalação até agora)
    const agora = new Date().getTime();
    const dataInstalacao = equipamento.data_instalacao.getTime();
    const tempoVidaTotalHoras = (agora - dataInstalacao) / (1000 * 60 * 60);

    // 4. Tempo em Operação (Uptime) = Vida Total - Paradas
    const uptimeHoras = tempoVidaTotalHoras - totalDowntimeHoras;

    // 5. Cálculo dos Indicadores
    const mtbf = uptimeHoras / totalFalhas;
    const mttr = totalDowntimeHoras / totalFalhas;
    const disponibilidade = (uptimeHoras / tempoVidaTotalHoras) * 100;

    return {
      mtbf: mtbf.toFixed(2) + " h",
      mttr: mttr.toFixed(2) + " h",
      disponibilidade: disponibilidade.toFixed(2) + "%",
      totalFalhas: totalFalhas
    };
  }
}