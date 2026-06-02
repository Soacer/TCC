import { TipoLigacao } from '@prisma/client';

export interface SaveBlockDTO {
  id_bloco: string;
  tipo_bloco: string;
  posicao_x: number;
  posicao_y: number;
  equipamentoId?: string | null;
}

export interface SaveConnectionDTO {
  id_conexao: string;
  blocoOrigemId: string;
  blocoDestinoId: string;
  tipo_ligacao?: TipoLigacao;
}

export interface BlocoTopologia {
  id: string;
  tipo: string;
  origens: Set<string>;
  destinos: Set<string>;
}