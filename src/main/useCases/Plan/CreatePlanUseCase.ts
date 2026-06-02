import { PlanRepository } from '../../repositories/Plan/PlanRepository';
import { CreatePlanDTO } from '../../../shared/dto/Plan/createPlan.dto';

export class CreatePlanUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute(data: CreatePlanDTO) {
    if (!data.tipo_manutencao) {
      throw new Error("O tipo de manutenção é obrigatório.");
    }
    if (data.periocidade_dias <= 0) {
      throw new Error("A periocidade deve ser maior que zero.");
    }
    if (!data.tarefas || data.tarefas.length === 0) {
      throw new Error("Um plano precisa ter pelo menos uma tarefa.");
    }

    return await this.planRepository.create(data);
  }
}