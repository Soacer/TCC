import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FacilityRepository {
  // Cria uma nova planta
  async createPlanta(nome: string) {
    return await prisma.planta.create({ data: { nome } });
  }

  async createSetor(nome: string, plantaId: string) {
    return await prisma.setor.create({ data: { nome, plantaId } });
  }

  // Busca todas as plantas e os setores que pertencem a elas (Árvore)
  async getPlantas() {
    return await prisma.planta.findMany({
      where: { isActive: true },
      include: {
        setores: {
          where: { isActive: true },
          orderBy: { nome: 'asc' }
        }
      },
      orderBy: { nome: 'asc' }
    });
  }

  // 🟢 UPDATES
  async updatePlanta(id: string, nome: string) {
    return await prisma.planta.update({ where: { idplanta: id }, data: { nome } });
  }

  async updateSetor(id: string, nome: string) {
    return await prisma.setor.update({ where: { idsetor: id }, data: { nome } });
  }

  // 🟢 SOFT DELETES
  async deletePlanta(id: string) {
    // Apaga os setores atrelados em cascata
    await prisma.setor.updateMany({ where: { plantaId: id }, data: { isActive: false } });
    return await prisma.planta.update({ where: { idplanta: id }, data: { isActive: false } });
  }

  async deleteSetor(id: string) {
    return await prisma.setor.update({ where: { idsetor: id }, data: { isActive: false } });
  }
}