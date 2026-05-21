// src/renderer/src/env.d.ts

import { CreateEquipmentDTO } from '../../shared/dto/CreateEquipmentDTO';

// Estendemos a interface global Window
declare global {
  interface Window {
    api: {
      /**
       * Envia os dados para o processo Main criar um equipamento no banco.
       * @param data Objeto contendo os dados do equipamento (DTO)
       */
      createEquipment: (data: CreateEquipmentDTO) => Promise<any>;
      
      // Adicione aqui futuramente outras funções, ex:
      // listEquipments: () => Promise<any[]>;
    }
  }
}

export {};