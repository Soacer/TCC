import { prisma } from "../../database/prisma";

import type { CreateEquipmentDTO } from "../../../shared/dto/CreateEquipmentDTO";

export class EquipmentRepository {
  async create(data: CreateEquipmentDTO) {
    return await prisma.equipamento.create({
      data: {
        nome: data.nome,
        tag: data.tag,
        fabricante: data.fabricante,
        modelo: data.modelo,
        setor: data.setor,
        data_instalacao: data.data_instalacao,
        status: "OPERANDO",
        abc_idcriticidade: data.idcriticidade,
        xyz_idxyz: data.idxyz,
      },
    });
  }

  async findByTag(tag: string) {
    return await prisma.equipamento.findUnique({ where: { tag } });
  }

  async findAll() {
    return await prisma.equipamento.findMany({
      include: {
        abc: true,
        xyz: true,
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.equipamento.update({
      where: { idequipamentos: id },
      data: { isActive: false },
    });
  }

  async update(id: string, data: any) {
    return await prisma.equipamento.update({
      where: { idequipamentos: id },
      data: {
        nome: data.nome,
        tag: data.tag,
        fabricante: data.fabricante,
        modelo: data.modelo,
        setor: data.setor,
        abc_idcriticidade: data.idcriticidade,
        xyz_idxyz: data.idxyz,
      },
    });
  }

  async reactivate(id: string) {
    return await prisma.equipamento.update({
      where: { idequipamentos: id },
      data: { isActive: true }
    });
  }
}
