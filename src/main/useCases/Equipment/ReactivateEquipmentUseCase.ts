import { EquipmentRepository } from '../../repositories/Equipment/EquipmentRepository';

export class ReactivateEquipmentUseCase {
  constructor(private repository: EquipmentRepository) {}

  async execute(id: string) {
    return await this.repository.reactivate(id);
  }
}