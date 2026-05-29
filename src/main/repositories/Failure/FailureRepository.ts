import { prisma } from '../../database/prisma';

export class FailureRepository {
  
  // 1. Criar Registro de Falha
  async create(data: any) {
    return await prisma.falha.create({
      data: {
        descricao: data.descricao,
        data_hora_falha: data.data_hora_falha,
        data_hora_reparo: data.data_hora_reparo || null,
        tempo_parada_horas: data.tempo_parada_horas,

        equipamento: {
          connect: { idequipamentos: data.equipamento_id }
        },
        
        // A ligação que cria a causa raiz automaticamente continua intacta
        ...(data.causa_raiz_nome && data.causa_raiz_nome.trim() !== "" ? {
          causa_raiz: {
            connectOrCreate: {
              where: { nome: data.causa_raiz_nome.trim() },
              create: { nome: data.causa_raiz_nome.trim() }
            }
          }
        } : {})
      }
    });
  }

  async findAll(onlyActive: boolean = true) {
    return await prisma.falha.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      include: { 
        equipamento: true, // Traz os dados da máquina (tag, nome, setor)
        causa_raiz: true   // Traz o nome da causa raiz
      },
      orderBy: { data_hora_falha: 'desc' }
    });
  }

  async findByEquipment(equipamentoId: string) {
    return await prisma.falha.findMany({
      where: {
        equipamento_id: equipamentoId,
        isActive: true
      },
      include: {
        causa_raiz: true
      },
      orderBy: { data_hora_falha: 'desc' }
    });
  }

  async update(id: string, data: any) {
    return await prisma.falha.update({
      where: { idfalhas: id },
      data: {
        descricao: data.descricao,
        data_hora_falha: data.data_hora_falha,
        data_hora_reparo: data.data_hora_reparo,
        tempo_parada_horas: data.tempo_parada_horas,
        equipamento_id: data.equipamento_id,
        causa_raiz_id: data.causa_raiz_id || null,
      }
    });
  }

  async softDelete(id: string) {
    return await prisma.falha.update({
      where: { idfalhas: id },
      data: { isActive: false }
    });
  }

  async reactivate(id: string) {
    return await prisma.falha.update({
      where: { idfalhas: id },
      data: { isActive: true }
    });
  }

}