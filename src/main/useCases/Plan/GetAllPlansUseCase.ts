import { PlanRepository } from '../../repositories/Plan/PlanRepository';

export class GetAllPlansUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute() {
    return await this.planRepository.findAll();
  }
}