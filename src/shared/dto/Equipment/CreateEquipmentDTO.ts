import { TipoEquipamento } from "@prisma/client";

export interface CreateEquipmentDTO {
  nome: string;
  tipo: TipoEquipamento;
  tag: string;
  fabricante: string;
  modelo: string;
  setorId: string;
  data_instalacao: Date;
  idcriticidade: number;
  idxyz: number;
  status: "OPERANDO" | "MANUTENCAO" | "PARADO" | "FALHA";
}