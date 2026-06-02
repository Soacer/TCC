import { EquipmentHasPlanRepository } from '../../repositories/EquipmentHasPlan/EquipmentHasPlanRepository';

export class RegisterExecutionUseCase {
  constructor(private repository: EquipmentHasPlanRepository) {}

  async execute(idVinculo: string, dataExecucao: Date, periocidadeDias: number) {
    if (!idVinculo || !dataExecucao || !periocidadeDias) {
      throw new Error("Dados insuficientes para registar a execução do plano.");
    }
    return await this.repository.registerExecution(idVinculo, new Date(dataExecucao), periocidadeDias);
  }
}