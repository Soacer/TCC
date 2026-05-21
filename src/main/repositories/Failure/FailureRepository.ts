import { prisma } from '../../database/prisma';

export class FailureRepository {
  /**
   * Abre um registro de falha (Data/Hora de início).
   */
  async open(equipmentId: string, descricao: string) {
    return await prisma.falha.create({
      data: {
        data_hora_falha: new Date(),
        descricao,
        equipamentos_idequipamentos: equipmentId
      }
    });
  }

  /**
   * Encerra um reparo e calcula o tempo de parada.
   */
  async close(failureId: string, causaRaiz: string, horasParado: number) {
    return await prisma.falha.update({
      where: { idfalhas: failureId },
      data: {
        data_hora_reparo: new Date(),
        causa_raiz: causaRaiz,
        tempo_parada_horas: horasParado
      }
    });
  }
}