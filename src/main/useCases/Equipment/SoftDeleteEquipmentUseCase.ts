import { EquipmentRepository } from '../../repositories/Equipment/EquipmentRepository';

export class SoftDeleteEquipmentUseCase {
  constructor(private repository: EquipmentRepository) {}

  async execute(id: string) {
    return await this.repository.softDelete(id);
  }
}