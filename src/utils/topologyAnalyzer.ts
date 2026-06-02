import { TipoLigacao } from '@prisma/client';
import { SaveBlockDTO, SaveConnectionDTO, BlocoTopologia } from '../shared/dto/DigitalTwin/digitalTwin.dto';

/**
 * Analisa o grafo e classifica conexões como SERIE ou PARALELO puramente com base nas regras de engenharia.
 */
export function classificarTopologia(
  blocks: SaveBlockDTO[], 
  connections: SaveConnectionDTO[]
): SaveConnectionDTO[] {
  
  const mapaGrafos = new Map<string, BlocoTopologia>();

  blocks.forEach(b => {
    mapaGrafos.set(b.id_bloco, {
      id: b.id_bloco,
      tipo: b.tipo_bloco,
      origens: new Set(),
      destinos: new Set()
    });
  });

  connections.forEach(c => {
    if (mapaGrafos.has(c.blocoDestinoId)) mapaGrafos.get(c.blocoDestinoId)!.origens.add(c.blocoOrigemId);
    if (mapaGrafos.has(c.blocoOrigemId)) mapaGrafos.get(c.blocoOrigemId)!.destinos.add(c.blocoDestinoId);
  });

  const blocosEmParalelo = new Set<string>();
  const arrayBlocos = Array.from(mapaGrafos.values());

  for (let i = 0; i < arrayBlocos.length; i++) {
    for (let j = i + 1; j < arrayBlocos.length; j++) {
      const blocoA = arrayBlocos[i];
      const blocoB = arrayBlocos[j];

      if (blocoA.tipo === blocoB.tipo) {
        const compartilhaOrigem = [...blocoA.origens].some(o => blocoB.origens.has(o));
        const compartilhaDestino = [...blocoA.destinos].some(d => blocoB.destinos.has(d));

        let isParallel = false;

        switch (blocoA.tipo) {
          case 'bomba':
          case 'compressor':
          case 'motor':
          case 'valvula':
          case 'valvula_controle':
          case 'tanque':
          case 'permutador':
            isParallel = compartilhaOrigem && compartilhaDestino;
            break;
          default:
            isParallel = false;
        }

        if (isParallel) {
          blocosEmParalelo.add(blocoA.id);
          blocosEmParalelo.add(blocoB.id);
        }
      }
    }
  }

  return connections.map(c => {
    const ehMalhaParalela = blocosEmParalelo.has(c.blocoOrigemId) || blocosEmParalelo.has(c.blocoDestinoId);
    return {
      id_conexao: c.id_conexao,
      blocoOrigemId: c.blocoOrigemId,
      blocoDestinoId: c.blocoDestinoId,
      tipo_ligacao: (ehMalhaParalela ? "PARALELO" : "SERIE") as TipoLigacao
    };
  });
}