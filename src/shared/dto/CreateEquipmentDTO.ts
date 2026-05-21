export interface CreateEquipmentDTO {
  nome: string;
  tag: string;
  fabricante: string;
  modelo: string;
  setor: string;
  data_instalacao: Date;
  idcriticidade: number;
  idxyz: number;
  status: "OPERANDO" | "MANUTENCAO" | "PARADO" | "FALHA";
}