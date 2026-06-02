import { EquipmentRepository } from '../../repositories/Equipment/EquipmentRepository';
import type { CreateEquipmentDTO } from '../../../shared/dto/Equipment/CreateEquipmentDTO';

export class CreateEquipmentUseCase {
  constructor(private equipmentRepository: EquipmentRepository) {}

  /**
   * Executa a lógica de criação de um equipamento.
   */
  async execute(data: CreateEquipmentDTO) {
    // Regra 1: Não pode ter TAG duplicada
    const equipmentExists = await this.equipmentRepository.findByTag(data.tag);
    if (equipmentExists) {
      throw new Error(`O equipamento com a TAG ${data.tag} já está cadastrado.`);
    }

    // Regra 2: A data de instalação não pode ser no futuro
    if (new Date(data.data_instalacao) > new Date()) {
      throw new Error("A data de instalação não pode ser uma data futura.");
    }

    // Se passou nas regras, manda o repositório salvar
    const equipment = await this.equipmentRepository.create(data);

    return equipment;
  }
}