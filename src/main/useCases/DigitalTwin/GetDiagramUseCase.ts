import { DigitalTwinRepository } from '../../repositories/DigitalTwin/DigitalTwinRepository';

export class GetDiagramUseCase {
  constructor(private repository: DigitalTwinRepository) {}

  async execute(setorId: string) {
    if (!setorId) throw new Error("O ID do setor é obrigatório para carregar o diagrama.");
    return await this.repository.findBySetor(setorId);
  }
}