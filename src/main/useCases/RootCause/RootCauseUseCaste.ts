import { RootCauseRepository } from '../../repositories/RootCause/RootCauseRepository';

export class GetCausasRaizUseCase {
  constructor(private repository: RootCauseRepository) {}

  async execute() {
    return await this.repository.findAll();
  }
}