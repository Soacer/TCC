import { EquipmentRepository } from "../../repositories/Equipment/EquipmentRepository";

export class SelectAllEquipmentUseCase {
  constructor(private equipmentRepository: EquipmentRepository) {}

  async execute() {
    return await this.equipmentRepository.findAll();
  }
}
