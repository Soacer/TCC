// src/main/repositories/RootCauses/RootCauseRepository.ts
import { prisma } from '../../database/prisma';

export class RootCauseRepository {
  
  // Busca todas as causas cadastradas no dicionário
  async findAll() {
    return await prisma.causaRaiz.findMany({
      orderBy: { nome: 'asc' }
    });
  }
}