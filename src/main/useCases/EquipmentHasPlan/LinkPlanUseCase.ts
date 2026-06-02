import { EquipmentHasPlanRepository } from '../../repositories/EquipmentHasPlan/EquipmentHasPlanRepository';

export class LinkPlanUseCase {
  constructor(private repository: EquipmentHasPlanRepository) {}

  async execute(equipamentoId: string, planoId: string) {
    if (!equipamentoId || !planoId) {
      throw new Error("Os IDs do equipamento e do plano são obrigatórios.");
    }
    return await this.repository.link(equipamentoId, planoId);
  }
}