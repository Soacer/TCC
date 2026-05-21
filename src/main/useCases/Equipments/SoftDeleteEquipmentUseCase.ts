import { EquipmentRepository } from '../../repositories/Equipments/EquipmentRepository';

export class SoftDeleteEquipmentUseCase {
  constructor(private repository: EquipmentRepository) {}

  async execute(id: string) {
    return await this.repository.softDelete(id);
  }
}