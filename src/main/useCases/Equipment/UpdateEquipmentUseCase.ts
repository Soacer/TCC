import { EquipmentRepository } from '../../repositories/Equipment/EquipmentRepository';

export class UpdateEquipmentUseCase {
  constructor(private repository: EquipmentRepository) {}

  async execute(id: string, data: any) {
    return await this.repository.update(id, data);
  }
}