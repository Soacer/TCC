import { FailureRepository } from '../../repositories/Failure/FailureRepository';

export class CreateFailureUseCase {
  constructor(private repository: FailureRepository) {}

  async execute(data: any) {
    if (!data.equipamento_id) throw new Error("O equipamento afetado é obrigatório.");
    if (!data.descricao) throw new Error("A descrição do problema é obrigatória.");
    
    return await this.repository.create(data);
  }
}